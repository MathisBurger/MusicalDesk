use serde::Serialize;
use sqlx::PgPool;

#[derive(Serialize)]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub hex_color: String,
    pub is_income: bool,
}

impl Category {
    pub async fn find_by_id(id: i32, db: &PgPool) -> Option<Category> {
        sqlx::query_as!(
            Category,
            "SELECT * FROM expense_categories WHERE id = $1",
            id
        )
        .fetch_optional(db)
        .await
        .unwrap()
    }
}
