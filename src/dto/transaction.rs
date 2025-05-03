use std::collections::HashMap;

use chrono::{DateTime, Utc};
use serde::Serialize;
use serde_json::to_value;

use crate::{
    models::expense::{account::Account, category::Category, transaction::Transaction},
    serialize::Serializer,
};

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

impl Serializer<Transaction> for TransactionDto {
    fn find_in_serializer_cache(
        cache: &mut HashMap<String, serde_json::Value>,
        key: String,
    ) -> Option<serde_json::Value> {
        if cache.contains_key(&key) {
            return Some(cache.get(&key).unwrap().clone());
        }
        None
    }

    async fn serialize_from(
        cache: &mut HashMap<String, serde_json::Value>,
        input: &Transaction,
        db: &sqlx::PgPool,
    ) -> Self {
        let from_account = match Self::find_in_serializer_cache(
            cache,
            format!("account_{}", input.from_account_id),
        ) {
            Some(account) => account,
            None => serde_json::to_value(
                Account::get_account_by_id(input.from_account_id, db)
                    .await
                    .unwrap(),
            )
            .unwrap(),
        };

        let to_account =
            match Self::find_in_serializer_cache(cache, format!("account_{}", input.to_account_id))
            {
                Some(account) => account,
                None => serde_json::to_value(
                    Account::get_account_by_id(input.to_account_id, db)
                        .await
                        .unwrap(),
                )
                .unwrap(),
            };

        let category = match input.category_id {
            None => None,
            Some(category_id) => {
                match Self::find_in_serializer_cache(cache, format!("category_{}", category_id)) {
                    Some(x) => Some(x),
                    None => Some(
                        to_value(Category::find_by_id(category_id, db).await.unwrap()).unwrap(),
                    ),
                }
            }
        };

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
