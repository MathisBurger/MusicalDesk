use actix_web::web::{Data, Json, Path};
use actix_web::{get, post, HttpResponse};
use serde::Deserialize;

use crate::models::generic::UserRole;
use crate::models::{generic::Error, user::User};
use crate::util::role::validate_roles;
use crate::AppState;

#[derive(Deserialize)]
pub struct CreateUserRequest {
    pub username: String,
    pub password: String,
    pub roles: Vec<String>,
}

#[derive(Deserialize)]
pub struct UpdateUserRequest {
    pub roles: Vec<String>,
}

#[derive(Deserialize)]
pub struct UpdatePasswordRequest {
    pub password: String,
}

#[get("/users/self")]
pub async fn get_current_user(user: User) -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().json(user))
}

#[get("/users/{id}")]
pub async fn get_user(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    let requested_user = User::get_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    if user.has_role_or_admin(UserRole::EventAdmin)
        || user.has_role_or_admin(UserRole::TicketInvalidator)
    {
        return Ok(HttpResponse::Ok().json(requested_user));
    } else if user.id == requested_user.id {
        return Ok(HttpResponse::Ok().json(requested_user));
    }
    return Err(Error::Forbidden);
}

#[get("/users/backend")]
pub async fn get_backend_users(user: User, state: Data<AppState>) -> Result<HttpResponse, Error> {
    if !user.has_role(UserRole::Admin) {
        return Err(Error::Forbidden);
    }
    let users = User::get_backend_users(&state.database).await;
    Ok(HttpResponse::Ok().json(users))
}

#[get("/users/backend/{id}")]
pub async fn get_backend_user(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
) -> Result<HttpResponse, Error> {
    if !user.has_role(UserRole::Admin) {
        return Err(Error::Forbidden);
    }
    let user = User::get_by_id(path.0, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(user))
}

#[post("/users/backend")]
pub async fn create_backend_user(
    user: User,
    state: Data<AppState>,
    req: Json<CreateUserRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role(UserRole::Admin) {
        return Err(Error::Forbidden);
    }
    validate_roles(&req.roles)?;
    let user = User::create_user(&req, &state.database).await?;
    Ok(HttpResponse::Ok().json(user))
}

#[post("/users/backend/{id}")]
pub async fn update_backend_user(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
    req: Json<UpdateUserRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role(UserRole::Admin) {
        return Err(Error::Forbidden);
    }

    validate_roles(&req.roles)?;
    let user = User::update_user(path.0, &req, &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(user))
}

#[post("/users/backend/{id}/password")]
pub async fn update_backend_user_password(
    user: User,
    state: Data<AppState>,
    path: Path<(i32,)>,
    req: Json<UpdatePasswordRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role(UserRole::Admin) {
        return Err(Error::Forbidden);
    }
    let user = User::update_password(path.0, req.password.clone(), &state.database)
        .await
        .ok_or(Error::NotFound)?;
    Ok(HttpResponse::Ok().json(user))
}
