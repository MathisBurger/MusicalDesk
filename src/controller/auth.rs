use actix_web::cookie::time::Duration;

use crate::{
    models::{generic::Error, user::User},
    util::jwt::generate_jwt,
    AppState,
};
use actix_web::delete;
use actix_web::{
    cookie::{Cookie, SameSite},
    post, web, HttpResponse,
};
use bcrypt::verify;
use serde::Deserialize;

#[derive(Deserialize, Clone)]
struct LoginRequest {
    username: String,
    password: String,
}

#[post("/auth/login")]
pub async fn login(
    data: web::Json<LoginRequest>,
    state: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    let user_option = User::get_by_username(&data.username, &state.database).await;
    if let Some(user) = user_option {
        if verify(data.password.clone(), &user.password).unwrap() {
            let jwt_str = generate_jwt(&user);
            let mut cookie = Cookie::new("session", jwt_str);
            cookie.set_path("/");
            cookie.set_max_age(Duration::days(1));
            cookie.set_http_only(true);
            cookie.set_secure(false);
            cookie.set_same_site(SameSite::Strict);
            let mut resp = HttpResponse::Ok().finish();
            resp.add_cookie(&cookie).unwrap();
            return Ok(resp);
        }
        return Err(Error::Unauthorized);
    }
    Err(Error::NotFound)
}

#[delete("/auth/logout")]
pub async fn logout() -> HttpResponse {
    let mut cookie = Cookie::new("session", "");
    cookie.set_path("/");
    cookie.set_max_age(Duration::days(1));
    cookie.set_http_only(true);
    cookie.set_secure(false);
    cookie.set_same_site(SameSite::Strict);
    let mut resp = HttpResponse::Ok().finish();
    resp.add_cookie(&cookie).unwrap();
    resp
}
