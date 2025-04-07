use actix_web::{
    get,
    web::{Data, Path},
    HttpResponse,
};
use serde::Serialize;

use crate::{
    models::{event::Event, generic::Error, ticket::Ticket},
    AppState,
};

#[get("/shop/events")]
pub async fn get_current_events(state: Data<AppState>) -> HttpResponse {
    let events = Event::get_active_events(&state.database).await;
    HttpResponse::Ok().json(events)
}

#[derive(Serialize)]
struct ShopEvent {
    pub event: Event,
    pub tickets_left: i64,
}

#[get("/shop/events/{id}")]
pub async fn get_event(state: Data<AppState>, path: Path<(i32,)>) -> Result<HttpResponse, Error> {
    let event = Event::get_active_event_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    let tickets_left = Ticket::get_left_over_ticket_count(path.0, &state.database).await;
    Ok(HttpResponse::Ok().json(ShopEvent {
        event,
        tickets_left,
    }))
}
