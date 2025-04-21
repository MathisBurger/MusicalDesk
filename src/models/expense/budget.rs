use chrono::{DateTime, Utc};

pub struct Budget {
    pub id: i32,
    pub category_id: i32,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub budget: i32,
}
