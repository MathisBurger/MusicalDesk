use super::EventRequest;
use crate::{
    models::{
        event::event::Event,
        generic::{Error, UserRole},
        user::User,
    },
    service::stripe::{create_product, update_product},
    AppState,
};
use actix_web::{
    get, post,
    web::{Data, Json, Path},
    HttpRequest, HttpResponse,
};

#[post("/events")]
pub async fn create_event(
    state: Data<AppState>,
    user: User,
    data: Json<EventRequest>,
    req: HttpRequest,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::EventAdmin) {
        return Err(Error::Forbidden);
    }
    let event = Event::create_event(&data, &state.database).await?;
    let product = create_product(&event, generate_image_uri(&req, &event)).await?;
    let with_stripe = Event::update_stripe_references(event.id, &product, &state.database).await;
    Ok(HttpResponse::Ok().json(with_stripe))
}

#[get("/events")]
pub async fn get_events(state: Data<AppState>, user: User) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::EventAdmin) {
        return Err(Error::Forbidden);
    }
    let events = Event::get_events(&state.database).await;
    Ok(HttpResponse::Ok().json(events))
}

#[get("/events/{id}")]
pub async fn get_event(
    state: Data<AppState>,
    user: User,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::EventAdmin) {
        return Err(Error::Forbidden);
    }
    let event = Event::get_event(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(event))
}

#[post("/events/{id}")]
pub async fn update_event(
    state: Data<AppState>,
    user: User,
    data: Json<EventRequest>,
    path: Path<(i32,)>,
    req: HttpRequest,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::EventAdmin) {
        return Err(Error::Forbidden);
    }
    let event = Event::update_event(path.0, &data, &state.database).await?;
    let product = update_product(&event, generate_image_uri(&req, &event)).await?;
    let with_stripe = Event::update_stripe_references(event.id, &product, &state.database).await;
    Ok(HttpResponse::Ok().json(with_stripe))
}

fn generate_image_uri(req: &HttpRequest, event: &Event) -> String {
    let image_uri = req
        .url_for(
            "get_image",
            &[format!("{}", event.image_id.unwrap()).as_str()],
        )
        .unwrap();
    image_uri.to_string()
}
