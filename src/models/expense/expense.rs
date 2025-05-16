use serde::Serialize;
use sqlx::{prelude::FromRow, PgPool};

use crate::models::generic::Paginated;

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
}
