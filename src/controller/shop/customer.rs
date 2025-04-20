use actix_web::web;
use actix_web::web::Data;
use actix_web::{post, HttpResponse};
use serde::Deserialize;

use crate::models::generic::Error;
use crate::models::user::User;
use crate::service::stripe::create_customer;
use crate::AppState;

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
}

#[post("/auth/register_customer")]
pub async fn register_as_customer(
    state: Data<AppState>,
    data: web::Json<RegisterRequest>,
) -> Result<HttpResponse, Error> {
    let new_user = User::create_customer_account(&data, &state.database).await?;
    let customer = create_customer(&new_user).await?;
    let with_customer =
        User::update_stripe_customer_reference(new_user.id, &customer, &state.database).await;
    Ok(HttpResponse::Ok().json(with_customer))
}
