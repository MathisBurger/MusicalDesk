use chrono::{DateTime, Utc};

pub struct Report {
    pub id: i32,
    pub name: String,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
}
