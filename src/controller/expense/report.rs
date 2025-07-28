use actix_web::{
    get, post,
    web::{Data, Json, Path, Query},
    HttpResponse,
};
use chrono::{DateTime, Utc};
use serde::Deserialize;

use crate::{
    controller::PaginationQuery,
    dto::{report::ReportCategorySumupDto, transaction::TransactionDto},
    models::{
        expense::{
            report::{Report, ReportCategorySumup},
            transaction::Transaction,
        },
        generic::{Error, Paginated, UserRole},
        user::User,
    },
    serialize::serialize_many,
    AppState,
};

#[derive(Deserialize)]
pub struct CreateReportRequest {
    pub name: String,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
}

#[post("/expense/reports")]
pub async fn create_report(
    user: User,
    state: Data<AppState>,
    req: Json<CreateReportRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }

    let mut tx = state
        .database
        .begin()
        .await
        .map_err(|_x| Error::BadRequest)?;

    let report = Report::create(&req, &mut *tx).await;
    Report::create_transactions_mapping(&report, &mut *tx).await;
    ReportCategorySumup::create_in_range(report.id, &req.start_date, &req.end_date, &mut *tx).await;
    tx.commit().await.map_err(|_x| Error::BadRequest)?;

    Ok(HttpResponse::Ok().json(report))
}

#[get("/expense/reports")]
pub async fn get_reports(user: User, state: Data<AppState>) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let reports = Report::find_all(&state.database).await;
    Ok(HttpResponse::Ok().json(reports))
}

#[get("/expense/reports/{id}")]
pub async fn get_report(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let report = Report::find_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(report))
}

#[get("/expense/reports/{id}/transactions")]
pub async fn get_report_transactions(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
    query: Query<PaginationQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let transactions = Transaction::get_report_transactions_paginated(
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

#[get("/expense/reports/{id}/sumups")]
pub async fn get_report_category_sumups(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let sumups = ReportCategorySumup::find_by_report(path.0, &state.database).await;
    let result: Vec<ReportCategorySumupDto> = serialize_many(sumups, &state.database).await;
    Ok(HttpResponse::Ok().json(result))
}
