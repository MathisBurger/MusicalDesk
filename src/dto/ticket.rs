use chrono::{DateTime, Utc};
use serde::Serialize;

use crate::{models::ticket::UserTicket, util::aztec::generate_aztec_jwt};

#[derive(Serialize)]
pub struct UserTicketWithAztec {
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
