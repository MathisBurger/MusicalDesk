use actix_web::web::Data;
use actix_web::{get, HttpResponse};
use serde::Serialize;

use crate::models::event::{get_latest_three_events, get_total_ticket_count};
use crate::models::generic::{Error, UserRole};
use crate::models::user::User;
use crate::AppState;

#[get("/events/dashboard/last_three_events")]
pub async fn three_last_events(state: Data<AppState>, user: User) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::EventAdmin) {
        return Err(Error::Forbidden);
    }
    let events = get_latest_three_events(&state.database).await;
    Ok(HttpResponse::Ok().json(events))
}

#[derive(Serialize)]
struct TotalResponse {
    pub total: i64,
}

#[get("/events/dashboard/total_tickets")]
pub async fn total_tickets(state: Data<AppState>, user: User) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::EventAdmin) {
        return Err(Error::Forbidden);
    }
    let total = get_total_ticket_count(&state.database).await;
    Ok(HttpResponse::Ok().json(TotalResponse { total }))
}
