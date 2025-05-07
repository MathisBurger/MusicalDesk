use crate::{
    models::{
        expense::budget::Budget,
        generic::{Error, UserRole},
        user::User,
    },
    AppState,
};
use actix_web::{
    get, post,
    web::{Data, Json, Path, Query},
    HttpResponse,
};
use chrono::{DateTime, Utc};
use serde::Deserialize;

#[derive(Deserialize)]
struct BudgetsQuery {
    pub active: bool,
}

#[get("/expense/budgets")]
pub async fn get_all_budgets(
    user: User,
    state: Data<AppState>,
    query: Query<BudgetsQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let budgets = Budget::find_all(query.active, &state.database).await;
    Ok(HttpResponse::Ok().json(budgets))
}

#[derive(Deserialize)]
pub struct CreateBudgetRequest {
    pub name: String,
    pub category_id: i32,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub budget: i32,
}

#[post("/expense/budgets")]
pub async fn create_budget(
    user: User,
    state: Data<AppState>,
    req: Json<CreateBudgetRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let budget = Budget::create(&req, &state.database).await;
    Ok(HttpResponse::Ok().json(budget))
}

#[get("/expense/budgets/{id}")]
pub async fn get_budget(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let budget = Budget::find_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(budget))
}

pub async fn update_budget() {}

pub async fn get_budget_expenses() {}
