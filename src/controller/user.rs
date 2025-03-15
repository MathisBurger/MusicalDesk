use actix_web::{get, HttpResponse};

use crate::models::{generic::Error, user::User};

#[get("/users/self")]
pub async fn get_current_user(user: User) -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().json(user))
}
