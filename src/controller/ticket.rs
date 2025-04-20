use std::io::Read;

use actix_web::{
    get,
    http::header,
    post,
    web::{self, Data, Json, Path, Query},
    HttpResponse,
};
use chrono::{DateTime, Utc};
use serde::Deserialize;

use crate::{
    dto::ticket::UserTicketWithQrContent,
    models::{
        generic::{Error, UserRole},
        ticket::{Ticket, UserTicket},
        user::User,
    },
    util::qrcode::{generate_qr_code_image, generate_qrcode_jwt},
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

#[get("/tickets/{id}")]
pub async fn get_user_ticket(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    let ticket_option =
        UserTicket::get_user_ticket_by_id_and_owner(path.0, user.id, &state.database).await;
    if let Some(ticket) = ticket_option {
        return Ok(HttpResponse::Ok().json(UserTicketWithQrContent::from_user_ticket(&ticket)));
    }
    return Ok(HttpResponse::NotFound().finish());
}
