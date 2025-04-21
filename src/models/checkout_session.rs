use chrono::{DateTime, Utc};
use sqlx::Pool;
use sqlx::Postgres;

use super::generic::Error;

#[derive(Clone)]
pub struct DbCheckoutSession {
    pub session_id: String,
    // TODO: Check where these fields are needed.
    pub active_until: DateTime<Utc>,
    pub session_secret: String,
}

impl DbCheckoutSession {
    pub async fn create(
        session_id: String,
        active_until: DateTime<Utc>,
        session_secret: String,
        db: &Pool<Postgres>,
    ) -> Result<DbCheckoutSession, Error> {
        sqlx::query_as!(DbCheckoutSession, "INSERT INTO checkout_sessions (session_id, active_until, session_secret) VALUES ($1, $2, $3) RETURNING *", session_id, active_until, session_secret)
            .fetch_one(db)
            .await
            .map_err(|_x|Error::BadRequest)
    }

    pub async fn get_by_secret(
        session_secret: String,
        db: &Pool<Postgres>,
    ) -> Result<DbCheckoutSession, Error> {
        sqlx::query_as!(
            DbCheckoutSession,
            "SELECT * FROM checkout_sessions WHERE session_Secret = $1",
            session_secret
        )
        .fetch_optional(db)
        .await
        .expect("Cannot load checkout session")
        .ok_or(Error::NotFound)
    }

    pub async fn delete(session_id: String, db: &Pool<Postgres>) -> Result<(), Error> {
        sqlx::query!(
            "DELETE FROM checkout_sessions WHERE session_id = $1",
            session_id
        )
        .execute(db)
        .await
        .map_err(|_x| Error::BadRequest)?;
        Ok(())
    }

    pub async fn delete_pending(db: &Pool<Postgres>) {
        sqlx::query!("DELETE FROM checkout_sessions WHERE active_until < NOW()",)
            .execute(db)
            .await
            .expect("Cannot delete checkout sessions");
    }
}
