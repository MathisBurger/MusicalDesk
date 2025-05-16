use serde::Serialize;
use sqlx::{prelude::FromRow, PgPool};

use crate::{controller::expense::expense::ExpenseRequest, models::generic::Paginated};

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

    pub async fn create(req: &ExpenseRequest, db: &PgPool) -> Expense {
        sqlx::query_as!(Expense, "INSERT INTO expense_expenses (name, description, status, total_amount) VALUES ($1, $2, $3, $4) RETURNING *", req.name, req.description, ExpenseStatus::REQUEST.to_string(), req.total_amount)
            .fetch_one(db)
            .await.unwrap()
    }

    pub async fn update(id: i32, req: &ExpenseRequest, db: &PgPool) -> Option<Expense> {
        sqlx::query_as!(Expense, "UPDATE expense_expenses SET name = $1, description = $2, total_amount = $3 WHERE id = $4 RETURNING *", req.name, req.description, req.total_amount, id)
            .fetch_optional(db)
            .await
            .unwrap()
    }
}
