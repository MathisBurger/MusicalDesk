use crate::models::user::User;
use actix_web::cookie::Cookie;
use hmac::{digest::KeyInit, Hmac};
use jwt::{SignWithKey, VerifyWithKey};
use sha2::Sha256;
use std::collections::BTreeMap;

use super::time::{unix_timestamp, unix_timestamp_plus_3_days};

/// Generates an json web token string
pub fn generate_jwt(user: &User) -> String {
    let secret = std::env::var("JWT_SECRET").unwrap_or("secret".to_string());
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();

    let mut claims = BTreeMap::new();
    claims.insert("user_id", u64::try_from(user.id).unwrap());
    claims.insert("expires_at", unix_timestamp_plus_3_days());

    claims.sign_with_key(&key).unwrap()
}

pub fn get_user_id_from_cookie(cookie: Cookie) -> Option<i32> {
    let secret = std::env::var("JWT_SECRET").unwrap_or("secret".to_string());
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();

    let claims_option: Option<BTreeMap<String, u64>> = cookie.value().verify_with_key(&key).ok();

    if let Some(claims) = claims_option {
        if claims.contains_key("user_id") && claims.contains_key("expires_at") {
            if unix_timestamp() < *claims.get("expires_at").unwrap() {
                return i32::try_from(*claims.get("user_id").unwrap()).ok();
            }
        }
    }

    return None;
}
