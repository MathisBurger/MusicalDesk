use serde::Serialize;
use serde_json::{to_value, Value};
use sqlx::PgPool;

use crate::{
    models::expense::{expense::Expense, transaction::Transaction},
    serialize::Serializer,
};

use super::transaction::TransactionDto;

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

impl ExpenseDto {
    async fn get_transaction_option(
        cache: &mut std::collections::HashMap<String, serde_json::Value>,
        transaction_id: Option<i32>,
        db: &PgPool,
    ) -> Option<Value> {
        match transaction_id {
            None => None,
            Some(id) => match Self::find_in_serializer_cache(cache, format!("expense_{}", id)) {
                Some(x) => Some(x),
                None => match Transaction::find_by_id(id, db).await {
                    None => None,
                    Some(transaction) => Some(
                        to_value(TransactionDto::serialize_from(cache, &transaction, db).await)
                            .unwrap(),
                    ),
                },
            },
        }
    }
}
