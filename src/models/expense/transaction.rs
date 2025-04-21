use chrono::{DateTime, Utc};

pub struct Transaction {
    pub id: i32,
    pub amount: i32,
    pub from_account_id: i32,
    pub to_account_id: i32,
    pub timestamp: DateTime<Utc>,
    pub name: String,
    pub category_id: Option<i32>,
    pub is_money_transaction: bool,
}
