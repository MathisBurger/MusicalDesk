use actix_web::{post, web::Data, HttpResponse};
use serde::Serialize;

use crate::{
    models::{generic::Error, ticket::Ticket, user::User},
    service::stripe::generate_checkout,
    AppState,
};

#[derive(Serialize)]
struct PaymentSessionResponse {
    pub checkout_uri: String,
}

#[post("/shop/checkout")]
pub async fn create_shopping_cart_payment_session(
    user: User,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    let shopping_cart = Ticket::get_personal_shopping_cart(user.id, &state.database).await;
    if shopping_cart.len() == 0 {
        return Err(Error::BadRequest);
    }
    let checkout_session = generate_checkout(&user, shopping_cart).await?;
    Ok(HttpResponse::Ok().json(PaymentSessionResponse {
        checkout_uri: checkout_session.url.unwrap(),
    }))
}
