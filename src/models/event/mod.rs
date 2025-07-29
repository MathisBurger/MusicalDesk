use event::Event;
use sqlx::PgPool;

pub mod checkout_session;
pub mod event;
pub mod ticket;

pub async fn get_latest_three_events(db: &PgPool) -> Vec<Event> {
    sqlx::query_as!(
        Event,
        "SELECT * FROM events WHERE event_date > NOW() LIMIT 3"
    )
    .fetch_all(db)
    .await
    .expect("Cannot load all events")
}

pub async fn get_total_ticket_count(db: &PgPool) -> i64 {
    sqlx::query!("SELECT COUNT(*) as total FROM tickets")
        .fetch_one(db)
        .await
        .expect("Cannot load all events")
        .total
        .unwrap_or(0)
}
