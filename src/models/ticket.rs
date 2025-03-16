use chrono::DateTime;
use chrono::Utc;
use serde::Serialize;
use sqlx::Pool;
use sqlx::Postgres;

use super::generic::Error;

#[derive(Serialize)]
pub struct Ticket {
    pub id: i32,
    pub event_id: i32,
    pub valid_until: DateTime<Utc>,
    pub invalidated: bool,
    pub invalidated_at: Option<DateTime<Utc>>,
}

impl Ticket {
    pub async fn create_tickets(
        event_id: i32,
        quantity: u16,
        valid_until: DateTime<Utc>,
        db: &Pool<Postgres>,
    ) -> Result<(), Error> {
        let mut tx = db.begin().await.map_err(|_x| Error::BadRequest)?;
        for _i in 0..quantity {
            sqlx::query!(
                "INSERT INTO tickets (event_id, valid_until, invalidated) VALUES ($1, $2, $3)",
                event_id,
                valid_until,
                false
            )
            .execute(&mut *tx)
            .await
            .map_err(|_x| Error::BadRequest)?;
        }
        tx.commit().await.map_err(|_x| Error::BadRequest)?;
        Ok(())
    }

    pub async fn get_tickets_by_event_id(event_id: i32, db: &Pool<Postgres>) -> Vec<Ticket> {
        sqlx::query_as!(
            Ticket,
            "SELECT * FROM tickets WHERE event_id = $1",
            event_id
        )
        .fetch_all(db)
        .await
        .expect("Cannot load tickets")
    }
}
