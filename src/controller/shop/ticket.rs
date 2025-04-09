use chrono::{DateTime, Utc};
use serde::Serialize;

use crate::{
    models::{generic::Error, ticket::UserTicket, user::User},
    util::aztec::generate_aztec_jwt,
    AppState,
};
use actix_web::{get, web::Data, HttpResponse};

#[derive(Serialize)]
struct UserTicketWithAztec {
    pub id: i32,
    pub event_id: Option<i32>,
    pub event_name: Option<String>,
    pub event_image_id: Option<i32>,
    pub valid_until: DateTime<Utc>,
    pub invalidated: bool,
    pub invalidated_at: Option<DateTime<Utc>>,
    pub owner_id: Option<i32>,
    pub bought_at: Option<DateTime<Utc>>,
    pub aztec_content: String,
}

impl UserTicketWithAztec {
    pub fn from_user_ticket(ticket: &UserTicket) -> Self {
        UserTicketWithAztec {
            id: ticket.id,
            event_id: ticket.event_id,
            event_name: ticket.event_name.clone(),
            event_image_id: ticket.event_image_id,
            valid_until: ticket.valid_until,
            invalidated: ticket.invalidated,
            invalidated_at: ticket.invalidated_at,
            owner_id: ticket.owner_id,
            bought_at: ticket.bought_at,
            aztec_content: generate_aztec_jwt(ticket),
        }
    }
}

#[get("/shop/tickets/current")]
pub async fn get_current_user_tickets(
    user: User,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    let tickets_without_code = UserTicket::get_current_user_tickets(user.id, &state.database).await;
    let tickets_with_code: Vec<UserTicketWithAztec> = tickets_without_code
        .iter()
        .map(|user_ticket| UserTicketWithAztec::from_user_ticket(user_ticket))
        .collect();
    Ok(HttpResponse::Ok().json(tickets_with_code))
}

#[get("/shop/tickets/old")]
pub async fn get_old_user_tickets(
    user: User,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    let tickets_without_code = UserTicket::get_old_user_tickets(user.id, &state.database).await;
    let tickets_with_code: Vec<UserTicketWithAztec> = tickets_without_code
        .iter()
        .map(|user_ticket| UserTicketWithAztec::from_user_ticket(user_ticket))
        .collect();
    Ok(HttpResponse::Ok().json(tickets_with_code))
}
