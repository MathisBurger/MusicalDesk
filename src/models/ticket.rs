use chrono::DateTime;
use chrono::Duration;
use chrono::Utc;
use serde::Serialize;
use sqlx::Pool;
use sqlx::Postgres;
use stripe::CheckoutSessionId;

use super::generic::Error;

#[derive(Serialize, Debug)]
pub struct Ticket {
    pub id: i32,
    pub event_id: i32,
    pub valid_until: DateTime<Utc>,
    pub invalidated_at: Option<DateTime<Utc>>,
    pub owner_id: Option<i32>,
    pub bought_at: Option<DateTime<Utc>>,
    pub reserved_until: Option<DateTime<Utc>>,
    pub locked_in_checkout_session: Option<String>,
}

#[derive(Serialize, Debug)]
pub struct ShoppingCartItem {
    pub event_id: Option<i32>,
    pub image_id: Option<i32>,
    pub name: String,
    pub min_reserved_until: Option<DateTime<Utc>>,
    pub count: Option<i64>,
    pub total_price: Option<f32>,
    #[serde(skip_serializing)]
    pub price_id: Option<String>,
}

#[derive(Serialize)]
pub struct UserTicket {
    pub id: i32,
    pub event_id: Option<i32>,
    pub event_name: Option<String>,
    pub event_image_id: Option<i32>,
    pub valid_until: DateTime<Utc>,
    pub invalidated_at: Option<DateTime<Utc>>,
    pub owner_id: Option<i32>,
    pub bought_at: Option<DateTime<Utc>>,
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
                "INSERT INTO tickets (event_id, valid_until) VALUES ($1, $2)",
                event_id,
                valid_until
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

    pub async fn get_ticket_by_id(id: i32, db: &Pool<Postgres>) -> Option<Ticket> {
        sqlx::query_as!(Ticket, "SELECT * FROM tickets WHERE id = $1", id)
            .fetch_optional(db)
            .await
            .expect("Cannot load tickets")
    }

    pub async fn get_left_over_ticket_count(event_id: i32, db: &Pool<Postgres>) -> i64 {
        sqlx::query!("SELECT COUNT(*) AS count FROM tickets WHERE bought_at IS NULL AND locked_in_checkout_session IS NULL AND ( reserved_until IS NULL OR reserved_until < NOW()) AND event_id = $1", event_id)
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
        SELECT id FROM tickets WHERE event_id = $3 AND bought_at IS NULL AND locked_in_checkout_session IS NULL AND ( reserved_until IS NULL OR reserved_until < NOW()) LIMIT $4
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
        sqlx::query_as!(Ticket, "UPDATE tickets SET owner_id = NULL, reserved_until = NULL WHERE bought_at IS NULL AND locked_in_checkout_session IS NULL AND owner_id = $1 AND event_id = $2 RETURNING *", user_id, event_id)
        .fetch_all(db)
        .await
        .expect("Cannot cancel tickets")
    }

    /// Locks all tickets for checkout that are currently for this user in the shopping cart
    pub async fn lock_tickets_for_checkout(
        user_id: i32,
        session_id: &CheckoutSessionId,
        db: &Pool<Postgres>,
    ) -> Vec<Ticket> {
        sqlx::query_as!(Ticket, "UPDATE tickets SET locked_in_checkout_session = $1 WHERE owner_id = $2 AND reserved_until > NOW() AND bought_at IS NULL RETURNING *",session_id.as_str(), user_id)
            .fetch_all(db)
            .await
            .expect("Cannot lock tickets for checkout")
    }

    pub async fn mark_tickets_as_bought(
        session_id: String,
        db: &Pool<Postgres>,
    ) -> Result<Vec<Ticket>, Error> {
        sqlx::query_as!(Ticket, "UPDATE tickets SET bought_at = NOW(), reserved_until = NULL WHERE locked_in_checkout_session = $1 RETURNING *", session_id)
            .fetch_all(db)
            .await
            .map_err(|_x|Error::BadRequest)
    }

    pub async fn invalidate_ticket(ticket_id: i32, db: &Pool<Postgres>) -> Ticket {
        sqlx::query_as!(
            Ticket,
            "UPDATE tickets SET invalidated_at = NOW() WHERE id = $1 RETURNING *",
            ticket_id
        )
        .fetch_one(db)
        .await
        .expect("Cannot invalidate ticket")
    }
}

impl ShoppingCartItem {
    pub async fn get_personal_shopping_cart(
        user_id: i32,
        db: &Pool<Postgres>,
    ) -> Vec<ShoppingCartItem> {
        sqlx::query_as!(ShoppingCartItem, "SELECT e.id AS event_id, e.image_id AS image_id, e.name AS name, MIN(tickets.reserved_until) AS min_reserved_until, COUNT(tickets.id) AS count, SUM(e.price) AS total_price, e.price_id AS price_id FROM tickets
            JOIN events e on tickets.event_id = e.id
            WHERE owner_id = $1 AND bought_at IS NULL AND (reserved_until > NOW() OR locked_in_checkout_session IS NOT NULL) GROUP BY e.id", user_id)
        .fetch_all(db)
        .await
        .expect("Cannot load shopping cart items")
    }
}

impl UserTicket {
    pub async fn get_current_user_tickets(user_id: i32, db: &Pool<Postgres>) -> Vec<UserTicket> {
        sqlx::query_as!(UserTicket, "SELECT tickets.id AS id, e.id AS event_id, e.name AS event_name, e.image_id AS event_image_id, valid_until, invalidated_at, owner_id, bought_at
        FROM tickets JOIN events e ON e.id = event_id
        WHERE owner_id = $1 AND bought_at IS NOT NULL AND valid_until > NOW()", user_id)
            .fetch_all(db)
            .await
            .expect("Cannot load current user tickets")
    }

    pub async fn get_old_user_tickets(user_id: i32, db: &Pool<Postgres>) -> Vec<UserTicket> {
        sqlx::query_as!(UserTicket, "SELECT tickets.id AS id, e.id AS event_id, e.name AS event_name, e.image_id AS event_image_id, valid_until, invalidated_at, owner_id, bought_at
        FROM tickets JOIN events e ON e.id = event_id
        WHERE owner_id = $1 AND bought_at IS NOT NULL AND valid_until < NOW()", user_id)
            .fetch_all(db)
            .await
            .expect("Cannot load current user tickets")
    }

    pub async fn get_user_ticket_by_id_and_owner(
        id: i32,
        owner_id: i32,
        db: &Pool<Postgres>,
    ) -> Option<UserTicket> {
        sqlx::query_as!(UserTicket, "SELECT tickets.id AS id, e.id AS event_id, e.name AS event_name, e.image_id AS event_image_id, valid_until, invalidated_at, owner_id, bought_at
        FROM tickets JOIN events e ON e.id = event_id
        WHERE tickets.id = $1 AND owner_id = $2", id, owner_id)
            .fetch_optional(db)
            .await
            .expect("Cannot load current user tickets")
    }

    pub async fn get_user_ticket_by_id(id: i32, db: &Pool<Postgres>) -> Option<UserTicket> {
        sqlx::query_as!(UserTicket, "SELECT tickets.id AS id, e.id AS event_id, e.name AS event_name, e.image_id AS event_image_id, valid_until, invalidated_at, owner_id, bought_at
        FROM tickets JOIN events e ON e.id = event_id
        WHERE tickets.id = $1", id)
            .fetch_optional(db)
            .await
            .expect("Cannot load current user tickets")
    }
}
