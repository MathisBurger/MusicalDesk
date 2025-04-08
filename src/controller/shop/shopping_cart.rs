use actix_web::{
    delete, get, post,
    web::{Data, Json, Path},
    HttpResponse,
};
use serde::Deserialize;

use crate::{
    models::{generic::Error, ticket::Ticket, user::User},
    AppState,
};

#[derive(Deserialize)]
struct AddToShoppingCartRequest {
    pub event_id: i32,
    pub quantity: i64,
}

#[post("/shop/shopping_cart")]
pub async fn add_ticket_to_shopping_cart(
    user: User,
    state: Data<AppState>,
    req: Json<AddToShoppingCartRequest>,
) -> Result<HttpResponse, Error> {
    if user.current_checkout_session.is_some() {
        return Err(Error::Forbidden);
    }

    let tickets_left = Ticket::get_left_over_ticket_count(req.event_id, &state.database).await;
    if tickets_left < req.quantity {
        return Ok(HttpResponse::BadRequest().body("Not enough tickets left"));
    }

    let tickets =
        Ticket::reserve_for_event(req.event_id, user.id, req.quantity, &state.database).await;
    Ok(HttpResponse::Ok().json(tickets))
}

#[get("/shop/shopping_cart")]
pub async fn get_shopping_cart(user: User, state: Data<AppState>) -> HttpResponse {
    let shopping_cart = Ticket::get_personal_shopping_cart(user.id, &state.database).await;
    HttpResponse::Ok().json(shopping_cart)
}

#[delete("/shop/shopping_cart/{id}")]
pub async fn cancel_ticket_reservations(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> HttpResponse {
    let canceled_tickets =
        Ticket::cancel_ticket_reservations(path.0, user.id, &state.database).await;
    HttpResponse::Ok().json(canceled_tickets)
}
