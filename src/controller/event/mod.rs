use actix_web::web::ServiceConfig;
use chrono::{DateTime, Utc};
use serde::Deserialize;

mod dashboard;
mod event;
mod ticket;

#[derive(Deserialize)]
pub struct EventRequest {
    pub name: String,
    pub price: f32,
    pub tax_percentage: f32,
    pub image_id: Option<i32>,
    pub event_date: DateTime<Utc>,
    pub active_from: Option<DateTime<Utc>>,
    pub active_until: Option<DateTime<Utc>>,
    pub description: Option<String>,
    pub upper_reservation_limit: Option<i32>,
}

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(event::create_event)
        .service(event::get_events)
        .service(event::get_event)
        .service(event::update_event)
        .service(ticket::create_tickets_for_event)
        .service(ticket::get_tickets_for_event)
        .service(ticket::get_user_ticket)
        .service(ticket::invalidate_ticket)
        .service(ticket::view_ticket_by_qr_code)
        .service(dashboard::three_last_events)
        .service(dashboard::total_tickets);
}
