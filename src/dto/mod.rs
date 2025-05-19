use std::collections::HashMap;

use serde_json::{to_value, Value};
use sqlx::PgPool;
use transaction::TransactionDto;

use crate::{
    models::{
        expense::{account::Account, category::Category, transaction::Transaction},
        user::User,
    },
    serialize::Serializer,
};

pub mod budget;
pub mod expense;
pub mod report;
pub mod ticket;
pub mod transaction;

pub trait SerializerHelper {
    fn find_in_serializer_cache(
        cache: &mut HashMap<String, serde_json::Value>,
        key: String,
    ) -> Option<serde_json::Value> {
        cache.get(&key).cloned()
    }

    async fn get_transaction_option(
        cache: &mut std::collections::HashMap<String, Value>,
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

    async fn get_account(
        cache: &mut std::collections::HashMap<String, Value>,
        account_id: i32,
        db: &PgPool,
    ) -> Value {
        match Self::find_in_serializer_cache(cache, format!("account_{}", account_id)) {
            Some(account) => account,
            None => serde_json::to_value(Account::get_account_by_id(account_id, db).await.unwrap())
                .unwrap(),
        }
    }

    async fn get_user(
        cache: &mut std::collections::HashMap<String, Value>,
        user_id: i32,
        db: &PgPool,
    ) -> Value {
        match Self::find_in_serializer_cache(cache, format!("user_{}", user_id)) {
            Some(user) => user,
            None => serde_json::to_value(User::get_by_id(user_id, db).await.unwrap()).unwrap(),
        }
    }

    async fn get_category_option(
        cache: &mut std::collections::HashMap<String, Value>,
        category_id: Option<i32>,
        db: &PgPool,
    ) -> Option<Value> {
        match category_id {
            None => None,
            Some(cat_id) => {
                match Self::find_in_serializer_cache(cache, format!("category_{}", cat_id)) {
                    Some(x) => Some(x),
                    None => {
                        Some(to_value(Category::find_by_id(cat_id, db).await.unwrap()).unwrap())
                    }
                }
            }
        }
    }

    async fn get_category(
        cache: &mut std::collections::HashMap<String, Value>,
        category_id: i32,
        db: &PgPool,
    ) -> Value {
        match Self::find_in_serializer_cache(cache, format!("category_{}", category_id)) {
            Some(x) => x,
            None => to_value(Category::find_by_id(category_id, db).await.unwrap()).unwrap(),
        }
    }
}
