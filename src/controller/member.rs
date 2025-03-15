use actix_web::{
    get, post,
    web::{Data, Json},
    HttpResponse,
};
use serde::Deserialize;

use crate::{
    models::{
        generic::{Error, UserRole},
        member::Member,
        user::User,
    },
    AppState,
};

#[derive(Deserialize)]
pub struct CreateMemberRequest {
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub street: Option<String>,
    pub house_nr: Option<String>,
    pub zip: Option<String>,
    pub city: Option<String>,
    pub iban: Option<String>,
    pub membership_fee: Option<f32>,
}

#[post("/members")]
pub async fn create(
    data: Json<CreateMemberRequest>,
    state: Data<AppState>,
    user: User,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let member = Member::create(&data, &state.database).await?;
    Ok(HttpResponse::Ok().json(member))
}

#[get("/members")]
pub async fn list(state: Data<AppState>, user: User) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let members = Member::find_all(&state.database).await;
    Ok(HttpResponse::Ok().json(members))
}
