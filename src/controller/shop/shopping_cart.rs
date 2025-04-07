use actix_web::{
    get, post,
    web::{Data, Json},
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
