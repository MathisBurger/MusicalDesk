use std::collections::HashMap;

use serde::Serialize;
use sqlx::PgPool;

pub trait Serializer<T>
where
    T: Serialize,
    Self: Serialize,
{
    fn find_in_serializer_cache(
        cache: &mut HashMap<String, serde_json::Value>,
        key: String,
    ) -> Option<serde_json::Value>;
    async fn serialize_from(
        cache: &mut HashMap<String, serde_json::Value>,
        input: &T,
        db: &PgPool,
    ) -> Self;
}

pub async fn serialize_many<T, K>(inputs: Vec<T>, db: &PgPool) -> Vec<K>
where
    T: Serialize,
    K: Serializer<T>,
{
    let mut cache: HashMap<String, serde_json::Value> = HashMap::new();
    let mut results = Vec::new();
    for item in inputs {
        results.push(K::serialize_from(&mut cache, &item, db).await);
    }
    results
}
