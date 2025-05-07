use chrono::{DateTime, Utc};
use image::codecs::farbfeld;
use serde::Serialize;
use sqlx::PgPool;

use crate::controller::expense::budget::CreateBudgetRequest;

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

    pub async fn create(req: &CreateBudgetRequest, db: &PgPool) -> Budget {
        sqlx::query_as!(Budget, "INSERT INTO expense_budgets (name, category_id, start_date, end_date, budget) VALUES ($1, $2, $3, $4, $5) RETURNING *", req.name, req.category_id, req.start_date, req.end_date, req.budget)
            .fetch_one(db)
            .await
            .unwrap()
    }
}
