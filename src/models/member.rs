use crate::controller::member::MemberRequest;
use chrono::{serde::ts_seconds_option, DateTime, Utc};
use serde::Serialize;
use sqlx::{Pool, Postgres};

use super::generic::Error;

#[derive(Serialize)]
pub struct Member {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub street: Option<String>,
    pub house_nr: Option<String>,
    pub zip: Option<String>,
    pub city: Option<String>,
    pub iban: Option<String>,
    pub membership_fee: Option<f32>,
    pub joined_at: DateTime<Utc>,
    #[serde(with = "ts_seconds_option")]
    pub left_at: Option<DateTime<Utc>>,
}

impl Member {
    pub async fn create(create_req: &MemberRequest, db: &Pool<Postgres>) -> Result<Self, Error> {
        sqlx::query_as!(Member, "INSERT INTO members (first_name, last_name, email, street, house_nr, zip, city, iban, membership_fee, joined_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        create_req.first_name, create_req.last_name, create_req.email, create_req.street, create_req.house_nr, create_req.zip,
        create_req.city, create_req.iban, create_req.membership_fee, Utc::now()
        )
            .fetch_one(db)
            .await
            .map_err(|_x|Error::BadRequest)
    }

    pub async fn update(id: i32, req: &MemberRequest, db: &Pool<Postgres>) -> Result<Self, Error> {
        sqlx::query_as!(Member, "UPDATE members SET first_name = $1, last_name = $2, email = $3, street = $4, house_nr = $5, zip = $6, city = $7, iban = $8, membership_fee = $9 WHERE id = $10 RETURNING *",
        req.first_name, req.last_name, req.email, req.street, req.house_nr, req.zip,
        req.city, req.iban, req.membership_fee, id
        )
            .fetch_one(db)
            .await
            .map_err(|_x|Error::BadRequest)
    }

    pub async fn find_all(db: &Pool<Postgres>) -> Vec<Self> {
        sqlx::query_as!(Member, "SELECT * FROM members WHERE left_at IS NULL")
            .fetch_all(db)
            .await
            .expect("Cannot load all members")
    }

    pub async fn find_all_left(db: &Pool<Postgres>) -> Vec<Self> {
        sqlx::query_as!(Member, "SELECT * FROM members WHERE left_at IS NOT NULL")
            .fetch_all(db)
            .await
            .expect("Cannot load all members")
    }

    pub async fn find_by_id(id: i32, db: &Pool<Postgres>) -> Option<Self> {
        sqlx::query_as!(Member, "SELECT * FROM members WHERE id = $1", id)
            .fetch_optional(db)
            .await
            .expect("Cannot load user")
    }

    pub async fn leave(id: i32, db: &Pool<Postgres>) -> Result<Self, Error> {
        sqlx::query_as!(
            Member,
            "UPDATE members SET left_at = NOW() WHERE id = $1 RETURNING *",
            id
        )
        .fetch_one(db)
        .await
        .map_err(|_x| Error::NotFound)
    }
}
