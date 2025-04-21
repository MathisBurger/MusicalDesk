use actix_web::{
    get, post,
    web::{Data, Json, Path},
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
    util::qrcode::get_ticket_id_from_qrcode_content,
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
    let ticket_option = if user.has_role_or_admin(UserRole::EventAdmin) {
        UserTicket::get_user_ticket_by_id(path.0, &state.database).await
    } else {
        UserTicket::get_user_ticket_by_id_and_owner(path.0, user.id, &state.database).await
    };

    if let Some(ticket) = ticket_option {
        return Ok(HttpResponse::Ok().json(UserTicketWithQrContent::from_user_ticket(&ticket)));
    }
    return Ok(HttpResponse::NotFound().finish());
}

#[derive(Deserialize)]
struct QrTicketRequest {
    pub qr_content: String,
}

#[post("/tickets/invalidate")]
pub async fn invalidate_ticket(
    user: User,
    state: Data<AppState>,
    req: Json<QrTicketRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::TicketInvalidator) {
        return Err(Error::Forbidden);
    }
    if let Some(ticket_id) = get_ticket_id_from_qrcode_content(req.qr_content.clone()) {
        let ticket = Ticket::get_ticket_by_id(ticket_id, &state.database)
            .await
            .ok_or(Error::NotFound)?;
        if ticket.owner_id.is_none() {
            return Err(Error::BadRequest);
        }
        let invalidated_ticket = Ticket::invalidate_ticket(ticket.id, &state.database).await;
        return Ok(HttpResponse::Ok().json(invalidated_ticket));
    }
    return Err(Error::BadRequest);
}

#[post("/tickets/view_by_qr_code")]
pub async fn view_ticket_by_qr_code(
    user: User,
    state: Data<AppState>,
    req: Json<QrTicketRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::TicketInvalidator) {
        return Err(Error::Forbidden);
    }
    if let Some(ticket_id) = get_ticket_id_from_qrcode_content(req.qr_content.clone()) {
        let ticket = Ticket::get_ticket_by_id(ticket_id, &state.database)
            .await
            .ok_or(Error::NotFound)?;
        return Ok(HttpResponse::Ok().json(ticket));
    }
    return Err(Error::BadRequest);
}
