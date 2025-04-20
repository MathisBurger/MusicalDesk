use super::qrcode::generate_qr_code_image;
use super::qrcode::generate_qrcode_jwt;
use crate::models::ticket::UserTicket;
use openssl::hash::{Hasher, MessageDigest};
use openssl::pkcs12::Pkcs12;
use openssl::pkcs7::Pkcs7;
use openssl::pkey::PKey;
use openssl::x509::X509;
use serde::Serialize;
use std::collections::BTreeMap;
use std::fs;
use std::io::Write;
use zip::write::FileOptions;

#[derive(Serialize)]
struct PkPass {
    description: String,
    formatVersion: u8,
    organizationName: String,
    passTypeIdentifier: String,
    serialNumber: String,
    teamIdentifier: String,
    eventTicket: serde_json::Value,
}

pub fn generate_pkpass(ticket: UserTicket) {
    let pass = PkPass {
        description: ticket.event_name.clone().unwrap(),
        formatVersion: 1,
        organizationName: ticket.event_name.clone().unwrap(),
        passTypeIdentifier: "pass.com.musicaldesk.ticket".to_string(),
        serialNumber: format!("{}", ticket.id),
        teamIdentifier: "default".to_string(),
        eventTicket: serde_json::json!({
            "primaryFields": [
                {
                    "key": "event",
                    "label": "Event",
                    "value": ticket.event_name.clone().unwrap()
                }
            ]
        }),
    };
    let pass_json = serde_json::to_vec(&pass).unwrap();

    let mut file_map = BTreeMap::new();
    file_map.insert("pass.json".to_string(), pass_json);
    let content = generate_qrcode_jwt(&ticket);
    file_map.insert("icon.png".to_string(), generate_qr_code_image(content));

    let manifest = generate_manifest(&file_map);
    let (pkey, cert) = load_cert_and_key("certs/pass.p12", "default_password");
    let signature = sign_manifest(&manifest, &pkey, &cert, "certs/AppleWWDRCA.pem");
    let zip_data = write_pkpass_zip(file_map, manifest, signature);
}

fn write_pkpass_zip(
    file_map: BTreeMap<String, Vec<u8>>,
    manifest: Vec<u8>,
    signature: Vec<u8>,
) -> Vec<u8> {
    let mut buf = std::io::Cursor::new(Vec::new());

    {
        let mut zip = zip::ZipWriter::new(&mut buf);
        let options = FileOptions::default();

        for (name, data) in &file_map {
            zip.start_file(name, options).unwrap();
            zip.write_all(data).unwrap();
        }

        zip.start_file("manifest.json", options).unwrap();
        zip.write_all(&manifest).unwrap();

        zip.start_file("signature", options).unwrap();
        zip.write_all(&signature).unwrap();

        zip.finish().unwrap();
    }

    buf.get_ref()[..buf.position() as usize].to_vec()
}

fn generate_manifest(file_map: &BTreeMap<String, Vec<u8>>) -> Vec<u8> {
    let mut manifest = BTreeMap::new();
    for (filename, data) in file_map {
        let mut hasher = Hasher::new(MessageDigest::sha1()).unwrap();
        hasher.update(data).unwrap();
        let hash = hasher.finish().unwrap();
        manifest.insert(filename, base64::encode(&hash));
    }
    serde_json::to_vec(&manifest).unwrap()
}

fn sign_manifest(
    manifest_data: &[u8],
    pkey: &PKey<openssl::pkey::Private>,
    cert: &X509,
    wwdr_cert_path: &str,
) -> Vec<u8> {
    let wwdr_cert = fs::read(wwdr_cert_path).unwrap();
    let wwdr = X509::from_pem(&wwdr_cert).unwrap();
    let mut stack = openssl::stack::Stack::new().unwrap();
    stack.push(wwdr).unwrap();

    let pkcs7 = Pkcs7::sign(
        cert,
        pkey,
        &stack,
        manifest_data,
        openssl::pkcs7::Pkcs7Flags::BINARY,
    )
    .unwrap();
    pkcs7.to_der().unwrap()
}

fn load_cert_and_key(p12_path: &str, password: &str) -> (PKey<openssl::pkey::Private>, X509) {
    let p12_der = fs::read(p12_path).expect("Failed to read p12");
    let parsed = Pkcs12::from_der(&p12_der).unwrap().parse(password).unwrap();
    (parsed.pkey, parsed.cert)
}
