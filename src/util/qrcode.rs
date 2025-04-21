use hmac::{Hmac, Mac};
use image::{DynamicImage, Luma};
use jwt::{SignWithKey, VerifyWithKey};
use sha2::Sha256;
use std::{collections::BTreeMap, io::Cursor};

use crate::models::ticket::UserTicket;

pub fn generate_qrcode_jwt(ticket: &UserTicket) -> String {
    let secret = std::env::var("QR_SECRET").unwrap_or("secret".to_string());
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();

    let mut claims = BTreeMap::new();
    claims.insert("id", ticket.id);
    claims.sign_with_key(&key).unwrap()
}

pub fn get_ticket_id_from_qrcode_content(content: String) -> Option<i32> {
    let secret = std::env::var("QR_SECRET").unwrap_or("secret".to_string());
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

#[allow(dead_code)] // Will be used later if we have apple and google wallet support
pub fn generate_qr_code_image(content: String) -> Vec<u8> {
    let code = qrcode::QrCode::new(content.as_bytes()).unwrap();
    let image = code.render::<Luma<u8>>().build();
    let mut buffer = Cursor::new(Vec::new());
    DynamicImage::ImageLuma8(image)
        .write_to(&mut buffer, image::ImageFormat::Png)
        .unwrap();
    buffer.into_inner()
}
