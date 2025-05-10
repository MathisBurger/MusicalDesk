use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::{postgres::PgRow, PgPool, Row};

use crate::controller::expense::budget::{CreateBudgetRequest, UpdateBudgetRequest};

#[derive(Serialize)]
pub struct Budget {
    pub id: i32,
    pub name: String,
    pub category_id: i32,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub budget: i32,
}

impl Budget {
    pub async fn find_all(active: bool, db: &PgPool) -> Vec<Budget> {
        match active {
            true => sqlx::query_as!(
                Budget,
                "SELECT * FROM expense_budgets WHERE $1 BETWEEN start_date AND end_date",
                Utc::now()
            )
            .fetch_all(db)
            .await
            .unwrap(),
            false => sqlx::query_as!(
                Budget,
                "SELECT * FROM expense_budgets WHERE $1 < start_date OR end_date < $1",
                Utc::now()
            )
            .fetch_all(db)
            .await
            .unwrap(),
        }
    }

    pub async fn find_by_id(id: i32, db: &PgPool) -> Option<Budget> {
        sqlx::query_as!(Budget, "SELECT * FROM expense_budgets WHERE id = $1", id)
            .fetch_optional(db)
            .await
            .unwrap()
    }

    pub async fn budget_spent(id: i32, db: &PgPool) -> i64 {
        let row = sqlx::query!("SELECT SUM(e.total_amount) AS total FROM expense_join_expense_budget m JOIN expense_expenses e ON m.expense_id = e.id WHERE m.budget_id = $1", id)
            .fetch_one(db)
            .await
            .unwrap();
        let total: i64 = row.total.unwrap_or(0);
        total
    }

    pub async fn create(req: &CreateBudgetRequest, db: &PgPool) -> Budget {
        sqlx::query_as!(Budget, "INSERT INTO expense_budgets (name, category_id, start_date, end_date, budget) VALUES ($1, $2, $3, $4, $5) RETURNING *", req.name, req.category_id, req.start_date, req.end_date, req.budget)
            .fetch_one(db)
            .await
            .unwrap()
    }

    pub async fn update(id: i32, req: &UpdateBudgetRequest, db: &PgPool) -> Option<Budget> {
        sqlx::query_as!(
            Budget,
            "UPDATE expense_budgets SET name = $1, budget = $2 WHERE id = $3 RETURNING *",
            req.name,
            req.budget,
            id
        )
        .fetch_optional(db)
        .await
        .unwrap()
    }
}
