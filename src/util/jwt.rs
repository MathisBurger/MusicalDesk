use crate::models::user::User;
use hmac::{digest::KeyInit, Hmac};
use jwt::SignWithKey;
use sha2::Sha256;
use std::collections::BTreeMap;

use super::time::unix_timestamp_plus_3_days;

/// Generates an json web token string
pub fn generate_jwt(user: &User) -> String {
    let secret = std::env::var("JWT_SECRET").unwrap_or("secret".to_string());
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();
    let mut claims = BTreeMap::new();
    claims.insert("userId", u64::try_from(user.id).unwrap());
    claims.insert("expires_at", unix_timestamp_plus_3_days());
    claims.sign_with_key(&key).unwrap()
}
