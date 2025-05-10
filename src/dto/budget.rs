use chrono::{DateTime, Utc};
use serde::Serialize;
use serde_json::Value;

use crate::{models::expense::budget::Budget, serialize::Serializer};

use super::SerializerHelper;

#[derive(Serialize)]
pub struct BudgetDto {
    pub id: i32,
    pub name: String,
    pub category: Value,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub budget: i32,
    pub spent: i64,
}

impl SerializerHelper for BudgetDto {}

impl Serializer<Budget> for BudgetDto {
    async fn serialize_from(
        cache: &mut std::collections::HashMap<String, serde_json::Value>,
        input: &Budget,
        db: &sqlx::PgPool,
    ) -> Self {
        let category = Self::get_category(cache, input.category_id, db).await;

        let spent = Budget::budget_spent(input.id, db).await;

        BudgetDto {
            id: input.id,
            name: input.name.clone(),
            category,
            start_date: input.start_date,
            end_date: input.end_date,
            budget: input.budget,
            spent,
        }
    }
}
