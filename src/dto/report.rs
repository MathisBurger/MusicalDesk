use serde::Serialize;
use serde_json::Value;

use crate::{models::expense::report::ReportCategorySumup, serialize::Serializer};

use super::SerializerHelper;

#[derive(Serialize)]
pub struct ReportCategorySumupDto {
    category: Option<Value>,
    sum: i32,
}

impl SerializerHelper for ReportCategorySumupDto {}

impl Serializer<ReportCategorySumup> for ReportCategorySumupDto {
    async fn serialize_from(
        cache: &mut std::collections::HashMap<String, serde_json::Value>,
        input: &ReportCategorySumup,
        db: &sqlx::PgPool,
    ) -> Self {
        ReportCategorySumupDto {
            sum: input.sum,
            category: Self::get_category_option(cache, input.category_id, db).await,
        }
    }
}
