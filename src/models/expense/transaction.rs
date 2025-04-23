use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::{prelude::FromRow, Pool, Postgres};

use crate::models::generic::Paginated;

#[derive(FromRow, Serialize)]
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

impl Transaction {
    pub async fn get_account_transactions_paginated(
        account_id: i32,
        page: i32,
        page_size: i32,
        db: &Pool<Postgres>,
    ) -> Paginated<Transaction> {
        Paginated::create_paginated_query(
            "*",
            "expense_transactions",
            Some("from_account_id = $1 OR to_account_id = $1"),
            page,
            page_size,
            vec![account_id],
            db,
        )
        .await
    }
}
