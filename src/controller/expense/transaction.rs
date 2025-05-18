use actix_web::{
    get, post,
    web::{Data, Json, Path, Query},
    HttpResponse,
};

use crate::{
    controller::PaginationQuery,
    dto::transaction::TransactionDto,
    models::{
        expense::transaction::{Transaction, TransactionRequest},
        generic::{Error, Paginated, UserRole},
        user::User,
    },
    serialize::{serialize_many, serialize_one},
    AppState,
};

#[post("/expense/transactions")]
pub async fn create_transaction(
    user: User,
    state: Data<AppState>,
    req: Json<TransactionRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let mut tx = state
        .database
        .begin()
        .await
        .map_err(|_x| Error::BadRequest)?;
    let transaction = Transaction::create(&req, &mut *tx).await?;
    tx.commit().await.unwrap();
    let result: TransactionDto = serialize_one(&transaction, &state.database).await;

    Ok(HttpResponse::Ok().json(result))
}

#[get("/expense/transactions")]
pub async fn get_transactions(
    user: User,
    state: Data<AppState>,
    query: Query<PaginationQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let transactions =
        Transaction::get_transactions_paginated(query.page, query.page_size, &state.database).await;
    let results: Paginated<TransactionDto> = Paginated {
        results: serialize_many(transactions.results, &state.database).await,
        total: transactions.total,
    };
    Ok(HttpResponse::Ok().json(results))
}

#[get("/expense/transactions/{id}")]
pub async fn get_transaction(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let transaction = Transaction::find_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    let result: TransactionDto = serialize_one(&transaction, &state.database).await;
    Ok(HttpResponse::Ok().json(result))
}
