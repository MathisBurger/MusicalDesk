use actix_web::{
    get,
    web::{Data, Path},
    HttpResponse,
};

use crate::{
    models::{event::Event, generic::Error},
    AppState,
};

#[get("/shop/events")]
pub async fn get_current_events(state: Data<AppState>) -> HttpResponse {
    let events = Event::get_active_events(&state.database).await;
    HttpResponse::Ok().json(events)
}

#[get("/shop/events/{id}")]
pub async fn get_event(state: Data<AppState>, path: Path<(i32,)>) -> Result<HttpResponse, Error> {
    // TODO: Add support for left tickets
    let event = Event::get_active_event_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(event))
}
