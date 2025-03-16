use actix_web::{
    get, post,
    web::{Data, Json, Path},
    HttpResponse,
};
use chrono::{DateTime, Utc};
use serde::Deserialize;

use crate::{
    models::{
        generic::{Error, UserRole},
        ticket::Ticket,
        user::User,
    },
    AppState,
};

#[derive(Deserialize)]
pub struct CreateTicketsRequest {
    pub valid_until: DateTime<Utc>,
    pub quantity: u16,
}

#[post("/events/{id}/tickets")]
pub async fn create_tickets_for_event(
    state: Data<AppState>,
    user: User,
    path: Path<(i32,)>,
    data: Json<CreateTicketsRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::EventAdmin) {
        return Err(Error::Forbidden);
    }
    Ticket::create_tickets(
        path.0,
        data.quantity,
        data.valid_until.clone(),
        &state.database,
    )
    .await?;
    Ok(HttpResponse::Ok().finish())
}

#[get("/events/{id}/tickets")]
pub async fn get_tickets_for_event(
    state: Data<AppState>,
    user: User,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::EventAdmin) {
        return Err(Error::Forbidden);
    }
    let tickets = Ticket::get_tickets_by_event_id(path.0, &state.database).await;
    Ok(HttpResponse::Ok().json(tickets))
}
