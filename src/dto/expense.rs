use serde::Serialize;
use serde_json::Value;

use crate::{models::expense::expense::Expense, serialize::Serializer};

use super::SerializerHelper;

#[derive(Serialize)]
pub struct ExpenseDto {
    pub id: i32,
    pub expense_transaction: Option<Value>,
    pub balancing_transaction: Option<Value>,
    pub name: String,
    pub description: String,
    pub is_request: bool,
    pub total_amount: i32,
}

impl SerializerHelper for ExpenseDto {}

impl Serializer<Expense> for ExpenseDto {
    async fn serialize_from(
        cache: &mut std::collections::HashMap<String, serde_json::Value>,
        input: &Expense,
        db: &sqlx::PgPool,
    ) -> Self {
        let expense_transaction =
            Self::get_transaction_option(cache, input.expense_transaction_id, db).await;
        let balancing_transaction =
            Self::get_transaction_option(cache, input.balancing_transaction_id, db).await;

        ExpenseDto {
            id: input.id,
            expense_transaction,
            balancing_transaction,
            name: input.name.clone(),
            description: input.description.clone(),
            is_request: input.is_request,
            total_amount: input.total_amount,
        }
    }
}
