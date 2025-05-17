use actix_multipart::form::{tempfile::TempFile, MultipartForm};
use actix_web::{
    get, post,
    web::{Data, Json, Path, Query},
    HttpResponse,
};
use serde::Deserialize;

use crate::{
    controller::PaginationQuery,
    dto::expense::{ExpenseDto, ExpenseWithImagesDto},
    models::{
        expense::{
            budget::Budget,
            expense::{Expense, ExpenseStatus},
            transaction::{Transaction, TransactionRequest},
        },
        generic::{Error, Paginated, UserRole},
        image::Image,
        user::User,
    },
    serialize::{serialize_many, serialize_one},
    AppState,
};

#[derive(Deserialize)]
pub struct ExpenseRequest {
    pub name: String,
    pub description: String,
    pub total_amount: i32,
}

#[post("/expense/expenses")]
pub async fn request_expense(
    user: User,
    state: Data<AppState>,
    req: Json<ExpenseRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::ExpenseRequestor) {
        return Err(Error::Forbidden);
    }
    let expense = Expense::create(&req, &user, &state.database).await;
    let response: ExpenseDto = serialize_one(&expense, &state.database).await;
    Ok(HttpResponse::Ok().json(response))
}

#[post("/expense/expenses/{id}")]
pub async fn update_expense(
    user: User,
    state: Data<AppState>,
    req: Json<ExpenseRequest>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    let mut expense = Expense::find_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;

    if !user.has_role_or_admin(UserRole::ExpenseRequestor) || expense.requestor_id != user.id {
        return Err(Error::Forbidden);
    }

    if expense.status != ExpenseStatus::REQUEST.to_string() {
        return Err(Error::Forbidden);
    }

    expense = Expense::update(path.0, &req, &state.database)
        .await
        .ok_or(Error::NotFound)?;

    let response: ExpenseDto = serialize_one(&expense, &state.database).await;
    Ok(HttpResponse::Ok().json(response))
}

#[get("/expense/expenses/{id}")]
pub async fn get_expense(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    let expense = Expense::find_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;

    if !(user.has_role_or_admin(UserRole::ExpenseRequestor) && user.id == expense.requestor_id)
        && !user.has_role_or_admin(UserRole::Accountant)
    {
        return Err(Error::Forbidden);
    }

    let response: ExpenseWithImagesDto = serialize_one(&expense, &state.database).await;
    Ok(HttpResponse::Ok().json(response))
}

#[get("/expense/expenses")]
pub async fn get_expenses(
    user: User,
    state: Data<AppState>,
    query: Query<PaginationQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::ExpenseRequestor)
        && !user.has_role_or_admin(UserRole::Accountant)
    {
        return Err(Error::Forbidden);
    }

    let paginated: Paginated<Expense> = if user.has_role_or_admin(UserRole::Accountant) {
        Expense::find_paginated(query.page, query.page_size, &state.database).await
    } else {
        Expense::find_for_requestor_paginated(user.id, query.page, query.page_size, &state.database)
            .await
    };

    let results: Paginated<ExpenseDto> = Paginated {
        results: serialize_many(paginated.results, &state.database).await,
        total: paginated.total,
    };
    Ok(HttpResponse::Ok().json(results))
}

#[derive(MultipartForm)]
struct UploadFileMultipart {
    #[multipart(limit = "10MB")]
    pub files: Vec<TempFile>,
}

#[post("/expense/expenses/{id}/images")]
pub async fn add_images_to_expense(
    user: User,
    state: Data<AppState>,
    MultipartForm(form): MultipartForm<UploadFileMultipart>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    let expense = Expense::find_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;

    if !(user.has_role_or_admin(UserRole::ExpenseRequestor) && user.id == expense.requestor_id)
        && !user.has_role_or_admin(UserRole::Accountant)
    {
        return Err(Error::Forbidden);
    }

    if expense.status != ExpenseStatus::REQUEST.to_string() {
        return Err(Error::Forbidden);
    }

    for file in form.files {
        let image = Image::create(
            &file.file_name.clone().unwrap_or("File".to_string()),
            file,
            true,
            Some(vec![UserRole::Accountant.to_string()]),
            Some(vec![user.id]),
            &state.database,
        )
        .await?;
        Expense::add_image_to(expense.id, image.id, &state.database).await;
    }
    Ok(HttpResponse::Ok().finish())
}

#[post("/expense/expenses/{id}/deny")]
pub async fn deny_expense(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }

    let expense = Expense::find_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;

    if expense.status != ExpenseStatus::REQUEST.to_string() {
        return Err(Error::Forbidden);
    }

    let mut tx = state
        .database
        .begin()
        .await
        .map_err(|_x| Error::BadRequest)?;

    Expense::set_status(expense.id, ExpenseStatus::DENIED, &mut *tx).await;
    tx.commit().await.unwrap();
    Ok(HttpResponse::Ok().finish())
}

#[derive(Deserialize)]
struct ExpenseTransactionRequest {
    pub amount: i32,
    pub from_account_id: i32,
    pub to_account_id: i32,
    pub category_id: Option<i32>,
}

#[derive(Deserialize)]
struct AcceptExpenseRequest {
    pub expense_transaction: ExpenseTransactionRequest,
    pub balancing_transaction: ExpenseTransactionRequest,
}

#[post("/expense/expenses/{id}/accept")]
pub async fn accept_expense(
    user: User,
    state: Data<AppState>,
    req: Json<AcceptExpenseRequest>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }

    let mut expense = Expense::find_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;

    if expense.status != ExpenseStatus::REQUEST.to_string() {
        return Err(Error::Forbidden);
    }

    let mut tx = state
        .database
        .begin()
        .await
        .map_err(|_x| Error::BadRequest)?;

    Expense::set_status(expense.id, ExpenseStatus::ACCEPTED, &mut *tx).await;

    let expense_transaction_req = TransactionRequest {
        amount: req.expense_transaction.amount,
        from_account_id: req.expense_transaction.from_account_id,
        to_account_id: req.expense_transaction.to_account_id,
        name: format!("[EXPENSE] {}", expense.name),
        category_id: req.expense_transaction.category_id,
        is_money_transaction: false,
    };

    let balancing_transaction_req = &TransactionRequest {
        amount: req.balancing_transaction.amount,
        from_account_id: req.balancing_transaction.from_account_id,
        to_account_id: req.balancing_transaction.to_account_id,
        name: format!("[BALANCING] {}", expense.name),
        category_id: req.balancing_transaction.category_id,
        is_money_transaction: true,
    };

    expense = Expense::set_transactions(
        expense.id,
        Transaction::create(&expense_transaction_req, &mut *tx).await?,
        Transaction::create(&balancing_transaction_req, &mut *tx).await?,
        &mut *tx,
    )
    .await;

    if let Some(category_id) = req.expense_transaction.category_id {
        let budget_ids = Budget::find_for_category_active_ids(category_id, &mut *tx).await;
        Budget::add_expense_to_budgets(expense.id, budget_ids, &mut *tx).await;
    }

    tx.commit().await.map_err(|_x| Error::BadRequest)?;

    let response: ExpenseDto = serialize_one(&expense, &state.database).await;
    Ok(HttpResponse::Ok().json(response))
}
