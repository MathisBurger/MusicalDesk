use std::collections::HashMap;

use chrono::{DateTime, Utc};
use serde::Serialize;
use serde_json::to_value;

use crate::{
    models::expense::{account::Account, category::Category, transaction::Transaction},
    serialize::Serializer,
};

use super::SerializerHelper;

#[derive(Serialize)]
pub struct TransactionDto {
    pub id: i32,
    pub amount: i32,
    pub from_account: serde_json::Value,
    pub to_account: serde_json::Value,
    pub timestamp: DateTime<Utc>,
    pub name: String,
    pub category: Option<serde_json::Value>,
    pub is_money_transaction: bool,
}

impl SerializerHelper for TransactionDto {}

impl Serializer<Transaction> for TransactionDto {
    async fn serialize_from(
        cache: &mut HashMap<String, serde_json::Value>,
        input: &Transaction,
        db: &sqlx::PgPool,
    ) -> Self {
        let from_account = Self::get_account(cache, input.from_account_id, db).await;
        let to_account = Self::get_account(cache, input.to_account_id, db).await;

        let category = Self::get_category_option(cache, input.category_id, db).await;

        TransactionDto {
            id: input.id,
            amount: input.amount,
            from_account,
            to_account,
            timestamp: input.timestamp,
            name: input.name.clone(),
            category,
            is_money_transaction: input.is_money_transaction,
        }
    }
}
