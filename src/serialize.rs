use std::collections::HashMap;

use serde::Serialize;
use sqlx::PgPool;

pub trait Serializer<T>
where
    T: Serialize,
    Self: Serialize,
{
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

pub async fn serialize_one<T, K>(input: &T, db: &PgPool) -> K
where
    T: Serialize,
    K: Serializer<T>,
{
    let mut cache: HashMap<String, serde_json::Value> = HashMap::new();
    K::serialize_from(&mut cache, input, db).await
}
