use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, Executor, PgPool, Pool, Postgres};

use crate::models::generic::{Error, Paginated};

use super::account::{Account, AccountType};

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
            Some("timestamp DESC"),
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
            Some("timestamp DESC"),
            page,
            page_size,
            vec![category_id],
            db,
        )
        .await
    }

    pub async fn create<'a, E>(req: &TransactionRequest, db: &mut E) -> Result<Transaction, Error>
    where
        for<'c> &'c mut E: Executor<'c, Database = Postgres>,
    {
        let from_account = Account::get_account_by_id(req.from_account_id, &mut *db)
            .await
            .ok_or(Error::NotFound)?;
        if from_account.account_type != AccountType::FLOW.to_string() {
            sqlx::query!(
                "UPDATE expense_accounts SET balance = balance - $1 WHERE id = $2",
                req.amount,
                req.from_account_id
            )
            .execute(&mut *db)
            .await
            .unwrap();
        }
        let to_account = Account::get_account_by_id(req.to_account_id, &mut *db)
            .await
            .ok_or(Error::NotFound)?;
        if to_account.account_type != AccountType::FLOW.to_string() {
            sqlx::query!(
                "UPDATE expense_accounts SET balance = balance + $1 WHERE id = $2",
                req.amount,
                req.to_account_id
            )
            .execute(&mut *db)
            .await
            .unwrap();
        }
        let res = sqlx::query_as!(Transaction, "INSERT INTO expense_transactions (amount, from_account_id, to_account_id, timestamp, name, category_id, is_money_transaction) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", req.amount, req.from_account_id, req.to_account_id, Utc::now(), req.name, req.category_id, req.is_money_transaction)
            .fetch_one(&mut *db)
            .await
            .unwrap();

        Ok(res)
    }
}
