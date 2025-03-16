use std::{fs::File, io::Read};

use actix_multipart::form::tempfile::TempFile;
use serde::Serialize;
use sha2::{Digest, Sha256};
use sqlx::{Pool, Postgres};

use crate::util::time::unix_timestamp;

use super::generic::Error;

#[derive(Serialize, Clone)]
pub struct Image {
    pub id: i32,
    pub name: String,
    pub local_file_name: String,
    pub private: bool,
    pub required_roles: Option<Vec<String>>,
}

impl Image {
    pub async fn create(
        name: &String,
        file: TempFile,
        private: bool,
        required_roles: Option<Vec<String>>,
        db: &Pool<Postgres>,
    ) -> Image {
        let local_path = get_local_filename(&file);
        file.file
            .persist(&local_path)
            .expect("Cannot save file to local storage");
        sqlx::query_as!(
            Image,
            "INSERT INTO images (name, local_file_name, private, required_roles) VALUES ($1, $2, $3, $4) RETURNING *",
            name,
            local_path,
            private,
            required_roles.as_deref()
        )
        .fetch_one(db)
        .await
        .expect("Cannot create image database entry")
    }

    pub async fn find_by_id(id: i32, db: &Pool<Postgres>) -> Result<Image, Error> {
        sqlx::query_as!(Image, "SELECT * FROM images WHERE id = $1", id)
            .fetch_one(db)
            .await
            .map_err(|_x| Error::NotFound)
    }
}

fn get_local_filename(file: &TempFile) -> String {
    let mut hasher = Sha256::new();
    let mut temp_file = File::open(&file.file).expect("Failed to open temp file");

    let mut buffer = [0; 4096];
    while let Ok(n) = temp_file.read(&mut buffer) {
        if n == 0 {
            break;
        }
        hasher.update(&buffer[..n]);
    }
    let hash = format!("{:x}", hasher.finalize());
    let base_name = format!("{}_{}", hash, unix_timestamp());
    let default_file_name = "".to_string();
    let file_extension = file
        .file_name
        .as_ref()
        .unwrap_or(&default_file_name)
        .rsplit('.')
        .next()
        .unwrap_or("");
    let file_name = if !file_extension.is_empty() {
        format!("{}.{}", base_name, file_extension)
    } else {
        base_name
    };
    format!("./uploads/{}", file_name)
}
