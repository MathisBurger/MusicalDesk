use std::collections::BTreeMap;

use hmac::{Hmac, Mac};
use jwt::{SignWithKey, VerifyWithKey};
use sha2::Sha256;

use crate::models::ticket::UserTicket;

pub fn generate_aztec_jwt(ticket: &UserTicket) -> String {
    let secret = std::env::var("AZTEC_SECRET").unwrap_or("secret".to_string());
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();

    let mut claims = BTreeMap::new();
    claims.insert("id", ticket.id);
    claims.sign_with_key(&key).unwrap()
}

pub fn get_ticket_id_from_aztec_content(content: String) -> Option<i32> {
    let secret = std::env::var("AZTEC_SECRET").unwrap_or("secret".to_string());
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();

    let claims_option: Option<BTreeMap<String, i32>> = content.verify_with_key(&key).ok();

    if let Some(claims) = claims_option {
        return match claims.get("id") {
            None => None,
            Some(x) => Some(*x),
        };
    }

    return None;
}
