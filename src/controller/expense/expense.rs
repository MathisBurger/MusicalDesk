use actix_web::{
    post,
    web::{Data, Json, Path},
    HttpResponse,
};
use serde::Deserialize;

use crate::{
    dto::expense::ExpenseDto,
    models::{
        expense::expense::Expense,
        generic::{Error, UserRole},
        user::User,
    },
    serialize::serialize_one,
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
    let expense = Expense::create(&req, &state.database).await;
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

pub async fn get_expense() {
    // Gets the expense with all images
}

pub async fn get_expenses() {
    // Gets all expenses without images
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
