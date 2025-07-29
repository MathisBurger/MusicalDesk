use crate::models::generic::{Error, UserRole};
use crate::models::membership::{get_member_count, get_total_earnings_this_year};
use crate::models::user::User;
use crate::AppState;
use actix_web::web::Data;
use actix_web::{get, HttpResponse};
use serde::Serialize;

#[derive(Serialize)]
struct TotalResponse {
    pub total: i64,
}

#[get("/members/dashboard/member_count")]
pub async fn member_count(state: Data<AppState>, user: User) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::EventAdmin) {
        return Err(Error::Forbidden);
    }
    let total = get_member_count(&state.database).await;
    Ok(HttpResponse::Ok().json(TotalResponse { total }))
}

#[derive(Serialize)]
struct TotalResponseF32 {
    pub total: f32,
}

#[get("/members/dashboard/yearly_earnings")]
pub async fn yearly_earnings(state: Data<AppState>, user: User) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::EventAdmin) {
        return Err(Error::Forbidden);
    }
    let total = get_total_earnings_this_year(&state.database).await;
    Ok(HttpResponse::Ok().json(TotalResponseF32 { total }))
}
