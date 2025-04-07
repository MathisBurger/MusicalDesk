use crate::controller::event::EventRequest;
use chrono::DateTime;
use chrono::Utc;
use serde::Serialize;
use sqlx::Pool;
use sqlx::Postgres;

use super::generic::Error;

#[derive(Serialize, Clone)]
pub struct Event {
    pub id: i32,
    pub name: String,
    pub price: f32,
    pub tax_percentage: f32,
    pub image_id: Option<i32>,
    pub event_date: DateTime<Utc>,
    pub active_from: Option<DateTime<Utc>>,
    pub active_until: Option<DateTime<Utc>>,
}

impl Event {
    pub async fn create_event(req: &EventRequest, db: &Pool<Postgres>) -> Result<Event, Error> {
        sqlx::query_as!(Event, "INSERT INTO events (name, price, tax_percentage, image_id, event_date, active_from, active_until) VALUES ($1, $2, $3, $4, $5,  $6, $7) RETURNING *", req.name, req.price, req.tax_percentage, req.image_id, req.event_date, req.active_from, req.active_until)
            .fetch_one(db)
            .await
            .map_err(|_x| Error::BadRequest)
    }

    pub async fn get_events(db: &Pool<Postgres>) -> Vec<Event> {
        sqlx::query_as!(Event, "SELECT * FROM events")
            .fetch_all(db)
            .await
            .expect("Cannot load all events")
    }

    pub async fn get_event(id: i32, db: &Pool<Postgres>) -> Option<Event> {
        sqlx::query_as!(Event, "SELECT * FROM events WHERE id = $1", id)
            .fetch_optional(db)
            .await
            .expect("Cannot load product")
    }

    pub async fn update_event(
        id: i32,
        req: &EventRequest,
        db: &Pool<Postgres>,
    ) -> Result<Event, Error> {
        sqlx::query_as!(Event, "UPDATE events SET name = $1, price = $2, tax_percentage = $3, image_id = $4, event_date = $5, active_from = $6, active_until = $7 WHERE id = $8 RETURNING *", req.name, req.price, req.tax_percentage, req.image_id, req.event_date, req.active_from, req.active_until, id)
            .fetch_one(db)
            .await
            .map_err(|_x| Error::BadRequest)
    }

    pub async fn get_active_events(db: &Pool<Postgres>) -> Vec<Event> {
        sqlx::query_as!(
            Event,
            "SELECT * FROM events WHERE NOW() BETWEEN COALESCE(active_from, '1900-01-01') AND COALESCE(active_until, '9999-12-31')"
        )
        .fetch_all(db)
        .await
        .expect("Cannot load active events")
    }

    pub async fn get_active_event_by_id(id: i32, db: &Pool<Postgres>) -> Option<Event> {
        sqlx::query_as!(
            Event,
            "SELECT * FROM events WHERE NOW() BETWEEN COALESCE(active_from, '1900-01-01') AND COALESCE(active_until, '9999-12-31') AND id = $1",
            id
        )
        .fetch_optional(db)
        .await
        .expect("Cannot load active events")
    }
}
