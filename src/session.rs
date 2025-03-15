use std::pin::Pin;

use actix_web::{error::ErrorUnauthorized, web::Data, Error, FromRequest};
use futures::Future;

use crate::{models::user::User, util::jwt::get_user_id_from_cookie, AppState};

impl FromRequest for User {
    type Error = Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(
        req: &actix_web::HttpRequest,
        _payload: &mut actix_web::dev::Payload,
    ) -> Self::Future {
        let cookie_option = req.cookie("session");
        if let Some(cookie) = cookie_option {
            if let Some(user_id) = get_user_id_from_cookie(cookie) {
                let data = req
                    .app_data::<Data<AppState>>()
                    .expect("app data missing")
                    .clone();
                return Box::pin(async move {
                    let user = User::get_by_id(user_id, &data.database).await.unwrap();
                    return Ok(user);
                });
            }
        }

        return Box::pin(async { Err(ErrorUnauthorized("Invalid session")) });
    }
}
