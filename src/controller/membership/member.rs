use super::MemberRequest;
use actix_web::{
    delete, get, post,
    web::{Data, Json, Path},
    HttpResponse,
};

use crate::{
    models::{
        generic::{Error, UserRole},
        membership::member::Member,
        user::User,
    },
    AppState,
};

#[post("/members")]
pub async fn create(
    data: Json<MemberRequest>,
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

#[get("/members_left")]
pub async fn list_left(state: Data<AppState>, user: User) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let members = Member::find_all_left(&state.database).await;
    Ok(HttpResponse::Ok().json(members))
}

#[get("/members/{id}")]
pub async fn get_member(
    state: Data<AppState>,
    user: User,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let member = Member::find_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(member))
}

#[post("/members/{id}")]
pub async fn update_member(
    state: Data<AppState>,
    user: User,
    path: Path<(i32,)>,
    data: Json<MemberRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let member = Member::update(path.0, &data, &state.database).await?;
    Ok(HttpResponse::Ok().json(member))
}

#[delete("/members/{id}/leave")]
pub async fn leave(
    state: Data<AppState>,
    user: User,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let member = Member::leave(path.0, &state.database).await?;
    Ok(HttpResponse::Ok().json(member))
}
