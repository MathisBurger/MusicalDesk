use crate::controller::expense::category::CreateCategoryRequest;
use serde::Serialize;
use sqlx::PgPool;

use crate::controller::expense::category::UpdateCategoryRequest;

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

    pub async fn find_all(search: Option<String>, db: &PgPool) -> Vec<Category> {
        let matched = match search {
            Some(s) => {
                sqlx::query_as!(
                    Category,
                    "SELECT * FROM expense_categories WHERE name LIKE $1 ORDER BY id",
                    format!("%{}%", s)
                )
                .fetch_all(db)
                .await
            }
            None => {
                sqlx::query_as!(Category, "SELECT * FROM expense_categories ORDER BY id")
                    .fetch_all(db)
                    .await
            }
        };

        matched.expect("Cannot get all categories")
    }

    pub async fn create(req: &CreateCategoryRequest, db: &PgPool) -> Category {
        sqlx::query_as!(Category, "INSERT INTO expense_categories (name, hex_color, is_income) VALUES ($1, $2, $3) RETURNING *", req.name, req.hex_color, req.is_income)
            .fetch_one(db)
            .await
            .unwrap()
    }

    pub async fn update(id: i32, req: &UpdateCategoryRequest, db: &PgPool) -> Option<Category> {
        sqlx::query_as!(
            Category,
            "UPDATE expense_categories SET name = $1, hex_color = $2 WHERE id = $3 RETURNING *",
            req.name,
            req.hex_color,
            id
        )
        .fetch_optional(db)
        .await
        .unwrap()
    }
}
