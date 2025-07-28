use actix_web::{
    get,
    web::{Data, Query},
    HttpResponse,
};
use serde::{Deserialize, Serialize};

use crate::{
    dto::{budget::BudgetDto, dashboard::MoneyOverTimeByCategoryDto},
    models::{
        expense::{
            budget::Budget, get_money_spent_over_time, get_money_spent_over_time_by_category,
            get_total_money_earned, get_total_money_spent, get_total_transactions_created,
            ScatterTransaction,
        },
        generic::{Error, UserRole},
        user::User,
    },
    serialize::serialize_many,
    AppState,
};

#[get("/expense/dashboard/budget_status")]
pub async fn current_budgets_status(
    user: User,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let budgets = Budget::find_all(true, &state.database).await;
    let result: Vec<BudgetDto> = serialize_many(budgets, &state.database).await;
    Ok(HttpResponse::Ok().json(result))
}

#[get("/expense/dashboard/last_transactions")]
pub async fn last_transactions(user: User, state: Data<AppState>) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let results = ScatterTransaction::find_last_100(&state.database).await;
    Ok(HttpResponse::Ok().json(results))
}

#[derive(Deserialize, Clone, Copy)]
pub enum TimePeriod {
    Week,
    Month,
    Year,
    FiveYear,
}

#[derive(Deserialize)]
struct TimePeriodQuery {
    pub period: TimePeriod,
}

#[derive(Serialize)]
struct TotalResponse {
    total: i64,
}

#[get("/expense/dashboard/total_money_spent")]
pub async fn total_money_spent(
    user: User,
    state: Data<AppState>,
    query: Query<TimePeriodQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let total = get_total_money_spent(query.period, &state.database).await;
    Ok(HttpResponse::Ok().json(TotalResponse { total }))
}

#[get("/expense/dashboard/total_money_earned")]
pub async fn total_money_earned(
    user: User,
    state: Data<AppState>,
    query: Query<TimePeriodQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let total = get_total_money_earned(query.period, &state.database).await;
    Ok(HttpResponse::Ok().json(TotalResponse { total }))
}

#[get("/expense/dashboard/total_transactions_created")]
pub async fn total_transactions_created(
    user: User,
    state: Data<AppState>,
    query: Query<TimePeriodQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let total = get_total_transactions_created(query.period, &state.database).await;
    Ok(HttpResponse::Ok().json(TotalResponse { total }))
}

#[get("/expense/dashboard/money_spent_over_time")]
pub async fn money_spent_over_time(
    user: User,
    state: Data<AppState>,
    query: Query<TimePeriodQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let total = get_money_spent_over_time(query.period, &state.database).await;
    Ok(HttpResponse::Ok().json(total))
}

#[get("/expense/dashboard/money_spent_over_time_by_category")]
pub async fn money_spent_over_time_by_category(
    user: User,
    state: Data<AppState>,
    query: Query<TimePeriodQuery>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::Accountant) {
        return Err(Error::Forbidden);
    }
    let spent = get_money_spent_over_time_by_category(query.period, &state.database).await;
    let serialized: Vec<MoneyOverTimeByCategoryDto> = serialize_many(spent, &state.database).await;
    Ok(HttpResponse::Ok().json(serialized))
}
