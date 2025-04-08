use actix_web::{
    get, post,
    web::{Data, Path},
    HttpRequest, HttpResponse,
};
use chrono::{DateTime, Duration, Utc};
use serde::Serialize;
use stripe::CheckoutSessionStatus;

use crate::{
    models::{checkout_session::DbCheckoutSession, generic::Error, ticket::Ticket, user::User},
    service::stripe::{generate_checkout, get_checkout_session},
    util::rand::generate_secret,
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
    req: HttpRequest,
) -> Result<HttpResponse, Error> {
    // the user can only have one checkout session at the same time
    if user.current_checkout_session.is_some() {
        return Err(Error::Forbidden);
    }

    let shopping_cart = Ticket::get_personal_shopping_cart(user.id, &state.database).await;
    if shopping_cart.len() == 0 {
        return Err(Error::BadRequest);
    }
    let expires_at: DateTime<Utc> = Utc::now() + Duration::minutes(30);
    let session_secret = generate_secret(255);

    let cancel_url = req
        .url_for("cancel_checkout_session", &[session_secret.clone()])
        .unwrap()
        .to_string();

    let success_url = req
        .url_for("checkout_success", &[session_secret.clone()])
        .unwrap()
        .to_string();

    let checkout_session = generate_checkout(
        &user,
        shopping_cart,
        expires_at.clone(),
        cancel_url,
        success_url,
    )
    .await?;

    DbCheckoutSession::create(
        checkout_session.id.to_string(),
        expires_at,
        session_secret,
        &state.database,
    )
    .await?;

    User::update_stripe_checkout_session_reference(user.id, &checkout_session.id, &state.database)
        .await;
    Ticket::lock_tickets_for_checkout(user.id, &checkout_session.id, &state.database).await;

    Ok(HttpResponse::Ok().json(PaymentSessionResponse {
        checkout_uri: checkout_session.url.unwrap(),
    }))
}

#[get(
    "/shop/cancel_checkout_session/{secret}",
    name = "cancel_checkout_session"
)]
pub async fn cancel_current_checkout_session(
    state: Data<AppState>,
    path: Path<(String,)>,
) -> Result<HttpResponse, Error> {
    let db_session = DbCheckoutSession::get_by_secret(path.0.clone(), &state.database).await?;
    let checkout_session = get_checkout_session(&db_session.session_id).await?;
    if checkout_session.status.unwrap() != CheckoutSessionStatus::Open {
        return Err(Error::BadRequest);
    }
    DbCheckoutSession::delete(db_session.session_id, &state.database).await?;

    let location = format!(
        "{}/shop/checkout-canceled",
        std::env::var("FRONTEND_URI").unwrap()
    );
    Ok(HttpResponse::SeeOther()
        .append_header(("Location", location.as_str()))
        .finish())
}

#[get("/shop/checkout_success/{secret}", name = "checkout_success")]
pub async fn checkout_successful(
    state: Data<AppState>,
    path: Path<(String,)>,
) -> Result<HttpResponse, Error> {
    let db_session = DbCheckoutSession::get_by_secret(path.0.clone(), &state.database).await?;
    let checkout_session = get_checkout_session(&db_session.session_id).await?;
    if checkout_session.status.unwrap() != CheckoutSessionStatus::Complete {
        return Err(Error::Forbidden);
    }
    // TODO: Add notice of payment ID
    Ticket::mark_tickets_as_bought(db_session.session_id.clone(), &state.database).await?;
    DbCheckoutSession::delete(db_session.session_id, &state.database).await?;

    let location = format!(
        "{}/shop/checkout-success",
        std::env::var("FRONTEND_URI").unwrap()
    );
    Ok(HttpResponse::SeeOther()
        .append_header(("Location", location.as_str()))
        .finish())
}

#[get("/shop/current_checkout_session")]
pub async fn current_checkout_session(user: User) -> Result<HttpResponse, Error> {
    if let Some(session_id) = user.current_checkout_session {
        let checkout_session = get_checkout_session(&session_id).await?;

        if checkout_session.status.unwrap() != CheckoutSessionStatus::Open {
            return Err(Error::BadRequest);
        }
        return Ok(HttpResponse::Ok().json(PaymentSessionResponse {
            checkout_uri: checkout_session.url.unwrap(),
        }));
    }
    Err(Error::NotFound)
}
