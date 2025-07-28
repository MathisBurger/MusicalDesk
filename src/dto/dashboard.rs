use serde::Serialize;
use serde_json::Value;

use crate::{models::expense::MoneyOverTimeByCategory, serialize::Serializer};

use super::SerializerHelper;

#[derive(Serialize)]
pub struct MoneyOverTimeByCategoryDto {
    pub time: i32,
    pub value: i64,
    pub category: Option<Value>,
}

impl SerializerHelper for MoneyOverTimeByCategoryDto {}

impl Serializer<MoneyOverTimeByCategory> for MoneyOverTimeByCategoryDto {
    async fn serialize_from(
        cache: &mut std::collections::HashMap<String, serde_json::Value>,
        input: &MoneyOverTimeByCategory,
        db: &sqlx::PgPool,
    ) -> Self {
        let category = Self::get_category_option(cache, input.category_id, db).await;

        MoneyOverTimeByCategoryDto {
            time: input.time,
            value: input.value,
            category,
        }
    }
}
