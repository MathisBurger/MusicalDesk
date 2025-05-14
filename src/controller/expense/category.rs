use crate::{
    controller::{PaginationQuery, SearchQuery},
    dto::transaction::TransactionDto,
    models::{
        expense::{category::Category, transaction::Transaction},
        generic::{Error, Paginated, UserRole},
        user::User,
    },
    serialize::serialize_many,
    AppState,
};
use actix_web::{
    get, post,
    web::{Data, Json, Path, Query},
    HttpResponse,
};
use serde::Deserialize;

#[get("/expense/categories")]
pub async fn get_categories(
    user: User,
    state: Data<AppState>,
    query: Query<SearchQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let categories = Category::find_all(query.search.clone(), &state.database).await;
    Ok(HttpResponse::Ok().json(categories))
}

#[get("/expense/categories/{id}")]
pub async fn get_category(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let category = Category::find_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(category))
}

#[get("/expense/categories/{id}/transactions")]
pub async fn get_category_transactions(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
    query: Query<PaginationQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let transactions = Transaction::get_category_transactions_paginated(
        path.0,
        query.page,
        query.page_size,
        &state.database,
    )
    .await;

    let result: Paginated<TransactionDto> = Paginated {
        results: serialize_many(transactions.results, &state.database).await,
        total: transactions.total,
    };
    Ok(HttpResponse::Ok().json(result))
}

#[derive(Deserialize)]
pub struct CreateCategoryRequest {
    pub name: String,
    pub hex_color: String,
    pub is_income: bool,
}

#[post("/expense/categories")]
pub async fn create_category(
    user: User,
    state: Data<AppState>,
    req: Json<CreateCategoryRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let category = Category::create(&req, &state.database).await;
    Ok(HttpResponse::Ok().json(category))
}

#[derive(Deserialize)]
pub struct UpdateCategoryRequest {
    pub name: String,
    pub hex_color: String,
}

#[post("/expense/categories/{id}")]
pub async fn update_category(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
    req: Json<UpdateCategoryRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let category = Category::update(path.0, &req, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(category))
}
