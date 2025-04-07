use chrono::DateTime;
use chrono::Duration;
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
    pub owner_id: Option<i32>,
    pub bought_at: Option<DateTime<Utc>>,
    pub reserved_until: Option<DateTime<Utc>>,
}

#[derive(Serialize)]
pub struct ShoppingCartItem {
    pub event_id: Option<i32>,
    pub image_id: Option<i32>,
    pub name: String,
    pub min_reserved_until: Option<DateTime<Utc>>,
    pub count: Option<i64>,
    pub total_price: Option<f32>,
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

    pub async fn get_personal_shopping_cart(
        user_id: i32,
        db: &Pool<Postgres>,
    ) -> Vec<ShoppingCartItem> {
        sqlx::query_as!(ShoppingCartItem, "SELECT e.id AS event_id, e.image_id AS image_id, e.name AS name, MIN(tickets.reserved_until) AS min_reserved_until, COUNT(tickets.id) AS count, SUM(e.price) AS total_price FROM tickets
            JOIN events e on tickets.event_id = e.id
            WHERE owner_id = $1 AND bought_at IS NULL AND reserved_until > NOW() GROUP BY e.id", user_id)
        .fetch_all(db)
        .await
        .expect("Cannot load shopping cart items")
    }

    pub async fn get_left_over_ticket_count(event_id: i32, db: &Pool<Postgres>) -> i64 {
        sqlx::query!("SELECT COUNT(*) AS count FROM tickets WHERE bought_at IS NULL AND ( reserved_until IS NULL OR reserved_until < NOW()) AND event_id = $1", event_id)
            .fetch_one(db)
            .await
            .expect("Cannot load lef tover tickets")
            .count
            .unwrap()
    }

    pub async fn reserve_for_event(
        event_id: i32,
        user_id: i32,
        amount: i64,
        db: &Pool<Postgres>,
    ) -> Vec<Ticket> {
        let reservation_deadline: DateTime<Utc> = Utc::now() + Duration::minutes(20);
        sqlx::query_as!(Ticket, "UPDATE tickets SET owner_id = $1, reserved_until = $2 WHERE id = ANY(
        SELECT id FROM tickets WHERE event_id = $3 AND bought_at IS NULL AND ( reserved_until IS NULL OR reserved_until < NOW()) LIMIT $4
        ) RETURNING *", user_id, reservation_deadline, event_id, amount)
        .fetch_all(db)
        .await
        .expect("Cannot reserve tickets")
    }

    pub async fn cancel_ticket_reservations(
        event_id: i32,
        user_id: i32,
        db: &Pool<Postgres>,
    ) -> Vec<Ticket> {
        let reservation_deadline: DateTime<Utc> = Utc::now() + Duration::minutes(20);
        sqlx::query_as!(Ticket, "UPDATE tickets SET owner_id = NULL, reserved_until = NULL WHERE bought_at IS NULL AND owner_id = $1 AND event_id = $2 RETURNING *", user_id, event_id)
        .fetch_all(db)
        .await
        .expect("Cannot cancel tickets")
    }
}
