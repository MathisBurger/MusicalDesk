use serde::Serialize;
use sqlx::{query_as, Executor, Pool, Postgres};

use crate::controller::expense::account::{CreateAccountRequest, UpdateAccountRequest};

pub enum AccountType {
    MONEY,
    MATERIAL,
    FLOW,
    FOREIGN,
}

impl AccountType {
    pub fn to_string(&self) -> String {
        match self {
            AccountType::MONEY => "MONEY".to_string(),
            AccountType::MATERIAL => "MATERIAL".to_string(),
            AccountType::FLOW => "FLOW".to_string(),
            AccountType::FOREIGN => "FOREIGN".to_string(),
        }
    }

    pub fn is_valid(value: &String) -> bool {
        value == &AccountType::MONEY.to_string()
            || value == &AccountType::MATERIAL.to_string()
            || value == &AccountType::FLOW.to_string()
            || value == &AccountType::FOREIGN.to_string()
    }
}

#[derive(Serialize)]
pub struct Account {
    pub id: i32,
    pub name: String,
    pub owner_name: String,
    pub iban: Option<String>,
    pub account_type: String,
    pub balance: i32,
}

impl Account {
    pub async fn get_accounts(search: Option<String>, db: &Pool<Postgres>) -> Vec<Account> {
        let matched = match search {
            Some(s) => {
                query_as!(
                    Account,
                    "SELECT * FROM expense_accounts WHERE name LIKE $1 ORDER BY id",
                    format!("%{}%", s)
                )
                .fetch_all(db)
                .await
            }
            None => {
                query_as!(Account, "SELECT * FROM expense_accounts ORDER BY id")
                    .fetch_all(db)
                    .await
            }
        };

        matched.expect("Cannot get all accounts")
    }

    pub async fn get_account_by_id<'a, E>(id: i32, db: E) -> Option<Account>
    where
        E: Executor<'a, Database = Postgres>,
    {
        query_as!(Account, "SELECT * FROM expense_accounts WHERE id = $1", id)
            .fetch_optional(db)
            .await
            .expect("Cannot load account")
    }

    pub async fn create_account(req: &CreateAccountRequest, db: &Pool<Postgres>) -> Account {
        query_as!(Account, "INSERT INTO expense_accounts (name, owner_name, iban, account_type, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *", req.name, req.owner_name, req.iban, req.account_type, 0)
            .fetch_one(db)
            .await.expect("Cannot create account")
    }

    pub async fn update_account(
        id: i32,
        req: &UpdateAccountRequest,
        db: &Pool<Postgres>,
    ) -> Option<Account> {
        query_as!(Account, "UPDATE expense_accounts SET name = $1, owner_name = $2, iban = $3 WHERE id = $4 RETURNING *", req.name, req.owner_name, req.iban, id)
            .fetch_optional(db)
            .await
            .expect("Cannot create account")
    }
}
