use crate::{
    controller::{PaginationQuery, SearchQuery},
    dto::transaction::TransactionDto,
    models::{
        expense::{
            account::{Account, AccountType},
            transaction::Transaction,
        },
        generic::{Error, Paginated, UserRole},
        user::User,
    },
    serialize::serialize_many,
    AppState,
};
use actix_web::{
    get,
    web::{Data, Json, Path, Query},
};
use actix_web::{post, HttpResponse};
use serde::Deserialize;

#[get("/expense/accounts")]
pub async fn get_accounts(
    user: User,
    state: Data<AppState>,
    query: Query<SearchQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let accounts = Account::get_accounts(query.search.clone(), &state.database).await;
    Ok(HttpResponse::Ok().json(accounts))
}

#[get("/expense/accounts/{id}")]
pub async fn get_account(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let account = Account::get_account_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(account))
}

#[get("/expense/accounts/{id}/transactions")]
pub async fn get_account_transactions(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
    query: Query<PaginationQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let transactions = Transaction::get_account_transactions_paginated(
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
pub struct CreateAccountRequest {
    pub name: String,
    pub owner_name: String,
    pub iban: Option<String>,
    pub account_type: String,
}

#[post("/expense/accounts")]
pub async fn create_account(
    user: User,
    state: Data<AppState>,
    req: Json<CreateAccountRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    if !AccountType::is_valid(&req.account_type) {
        return Err(Error::BadRequest);
    }
    let account = Account::create_account(&req, &state.database).await;
    Ok(HttpResponse::Ok().json(account))
}

#[derive(Deserialize)]
pub struct UpdateAccountRequest {
    pub name: String,
    pub owner_name: String,
    pub iban: Option<String>,
}

#[post("/expense/accounts/{id}")]
pub async fn update_account(
    user: User,
    state: Data<AppState>,
    req: Json<UpdateAccountRequest>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let account = Account::update_account(path.0, &req, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(account))
}
