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
        expense::expense::Expense,
        generic::{Error, Paginated, UserRole},
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
    if !user.has_role_or_admin(UserRole::ExpenseRequestor) {
        return Err(Error::Forbidden);
    }
    let expense = Expense::update(path.0, &req, &state.database)
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

pub async fn add_images_to_expense() {
    // Add images to expense
}

pub async fn deny_expense() {
    // Set status to denied
}

pub async fn accept_expense() {
    // Set status to accepted
    // Create both transactions
    // Add expense to budget
}
