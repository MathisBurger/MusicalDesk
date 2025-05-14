use serde::Serialize;
use sqlx::{query_as, Pool, Postgres};

use crate::controller::expense::account::{CreateAccountRequest, UpdateAccountRequest};

#[derive(Serialize)]
pub struct Account {
    pub id: i32,
    pub name: String,
    pub owner_name: String,
    pub iban: String,
    pub is_tracking_account: bool,
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

    pub async fn get_account_by_id(id: i32, db: &Pool<Postgres>) -> Option<Account> {
        query_as!(Account, "SELECT * FROM expense_accounts WHERE id = $1", id)
            .fetch_optional(db)
            .await
            .expect("Cannot load account")
    }

    pub async fn create_account(req: &CreateAccountRequest, db: &Pool<Postgres>) -> Account {
        query_as!(Account, "INSERT INTO expense_accounts (name, owner_name, iban, is_tracking_account) VALUES ($1, $2, $3, $4) RETURNING *", req.name, req.owner_name, req.iban, req.is_tracking_account)
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
