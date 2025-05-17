use serde::Serialize;
use sqlx::{prelude::FromRow, Executor, PgPool, Postgres};

use crate::{
    controller::expense::expense::ExpenseRequest,
    models::{generic::Paginated, image::Image, user::User},
};

use super::transaction::Transaction;

pub enum ExpenseStatus {
    REQUEST,
    DENIED,
    ACCEPTED,
}

impl ExpenseStatus {
    pub fn to_string(&self) -> String {
        match self {
            ExpenseStatus::REQUEST => "REQUEST".to_string(),
            ExpenseStatus::DENIED => "DENIED".to_string(),
            ExpenseStatus::ACCEPTED => "ACCEPTED".to_string(),
        }
    }
}

#[derive(Serialize, FromRow)]
pub struct Expense {
    pub id: i32,
    pub expense_transaction_id: Option<i32>,
    pub balancing_transaction_id: Option<i32>,
    pub name: String,
    pub description: String,
    pub status: String,
    pub total_amount: i32,
    pub requestor_id: i32,
}

impl Expense {
    pub async fn find_for_budget_paginated(
        budget_id: i32,
        page: i32,
        page_size: i32,
        db: &PgPool,
    ) -> Paginated<Expense> {
        Paginated::create_paginated_query(
            "e.*",
            "expense_expenses e JOIN expense_join_expense_budget j ON j.expense_id = e.id",
            Some("j.budget_id = $1"),
            Some("id DESC"),
            page,
            page_size,
            vec![budget_id],
            db,
        )
        .await
    }

    pub async fn find_for_requestor_paginated(
        requestor_id: i32,
        page: i32,
        page_size: i32,
        db: &PgPool,
    ) -> Paginated<Expense> {
        Paginated::create_paginated_query(
            "*",
            "expense_expenses",
            Some("requestor_id = $1"),
            Some("id DESC"),
            page,
            page_size,
            vec![requestor_id],
            db,
        )
        .await
    }

    pub async fn find_paginated(page: i32, page_size: i32, db: &PgPool) -> Paginated<Expense> {
        Paginated::create_paginated_query::<i32>(
            "*",
            "expense_expenses",
            None,
            Some("id DESC"),
            page,
            page_size,
            vec![],
            db,
        )
        .await
    }

    pub async fn find_by_id(id: i32, db: &PgPool) -> Option<Expense> {
        sqlx::query_as!(Expense, "SELECT * FROM expense_expenses WHERE id = $1", id)
            .fetch_optional(db)
            .await
            .unwrap()
    }

    pub async fn create(req: &ExpenseRequest, user: &User, db: &PgPool) -> Expense {
        sqlx::query_as!(Expense, "INSERT INTO expense_expenses (name, description, status, total_amount, requestor_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", req.name, req.description, ExpenseStatus::REQUEST.to_string(), req.total_amount, user.id)
            .fetch_one(db)
            .await.unwrap()
    }

    pub async fn update(id: i32, req: &ExpenseRequest, db: &PgPool) -> Option<Expense> {
        sqlx::query_as!(Expense, "UPDATE expense_expenses SET name = $1, description = $2, total_amount = $3 WHERE id = $4 RETURNING *", req.name, req.description, req.total_amount, id)
            .fetch_optional(db)
            .await
            .unwrap()
    }

    pub async fn set_status<'a, E>(id: i32, status: ExpenseStatus, db: &mut E) -> Expense
    where
        for<'c> &'c mut E: Executor<'c, Database = Postgres>,
    {
        sqlx::query_as!(
            Expense,
            "UPDATE expense_expenses SET status = $1 WHERE id = $2 RETURNING *",
            status.to_string(),
            id
        )
        .fetch_one(db)
        .await
        .unwrap()
    }

    pub async fn set_transactions<'a, E>(
        id: i32,
        expense_transaction: Transaction,
        balancing_transaction: Transaction,
        db: &mut E,
    ) -> Expense
    where
        for<'c> &'c mut E: Executor<'c, Database = Postgres>,
    {
        sqlx::query_as!(Expense, "UPDATE expense_expenses SET expense_transaction_id = $1, balancing_transaction_id = $2 WHERE id = $3 RETURNING *", expense_transaction.id, balancing_transaction.id, id)
            .fetch_one(db)
            .await
            .unwrap()
    }

    pub async fn find_images_for_id(id: i32, db: &PgPool) -> Vec<Image> {
        sqlx::query_as!(Image, "SELECT images.* FROM images JOIN expense_images ex ON ex.image_id = images.id WHERE ex.expense_id = $1", id)
            .fetch_all(db)
            .await
            .unwrap()
    }

    pub async fn add_image_to(id: i32, image_id: i32, db: &PgPool) {
        sqlx::query!(
            "INSERT INTO expense_images (expense_id, image_id) VALUES ($1, $2);",
            id,
            image_id
        )
        .execute(db)
        .await
        .unwrap();
    }
}
