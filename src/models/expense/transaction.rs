use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, PgPool, Pool, Postgres};

use crate::models::generic::Paginated;

#[derive(Deserialize)]
pub struct TransactionRequest {
    pub amount: i32,
    pub from_account_id: i32,
    pub to_account_id: i32,
    pub name: String,
    pub category_id: Option<i32>,
    pub is_money_transaction: bool,
}

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
    pub async fn find_by_id(id: i32, db: &PgPool) -> Option<Transaction> {
        sqlx::query_as!(
            Transaction,
            "SELECT * FROM expense_transactions WHERE id = $1",
            id
        )
        .fetch_optional(db)
        .await
        .unwrap()
    }

    pub async fn get_transactions_paginated(
        page: i32,
        page_size: i32,
        db: &Pool<Postgres>,
    ) -> Paginated<Transaction> {
        Paginated::create_paginated_query::<i32>(
            "*",
            "expense_transactions",
            None,
            Some("timestamp DESC"),
            page,
            page_size,
            vec![],
            db,
        )
        .await
    }

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
            None,
            page,
            page_size,
            vec![account_id],
            db,
        )
        .await
    }

    pub async fn get_category_transactions_paginated(
        category_id: i32,
        page: i32,
        page_size: i32,
        db: &Pool<Postgres>,
    ) -> Paginated<Transaction> {
        Paginated::create_paginated_query(
            "*",
            "expense_transactions",
            Some("category_id = $1"),
            None,
            page,
            page_size,
            vec![category_id],
            db,
        )
        .await
    }

    pub async fn create(req: &TransactionRequest, db: &PgPool) -> Transaction {
        sqlx::query_as!(Transaction, "INSERT INTO expense_transactions (amount, from_account_id, to_account_id, timestamp, name, category_id, is_money_transaction) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", req.amount, req.from_account_id, req.to_account_id, Utc::now(), req.name, req.category_id, req.is_money_transaction)
            .fetch_one(db)
            .await
            .unwrap()
    }
}
