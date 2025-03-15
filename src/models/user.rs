use serde::Serialize;
use sqlx::{Pool, Postgres};

use super::generic::UserRole;

#[derive(Clone, Serialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    #[serde(skip_serializing)]
    pub password: String,
    pub roles: Vec<String>,
}

impl User {
    pub fn has_role(&self, role: UserRole) -> bool {
        self.roles.contains(&role.to_string())
    }

    pub fn has_role_or_admin(&self, role: UserRole) -> bool {
        self.has_role(UserRole::Admin) || self.has_role(role)
    }

    pub async fn get_by_username(username: &String, pool: &Pool<Postgres>) -> Option<User> {
        sqlx::query_as!(User, "SELECT * FROM users WHERE username = $1", username)
            .fetch_optional(pool)
            .await
            .expect("Cannot load user")
    }

    pub async fn get_by_id(id: i32, pool: &Pool<Postgres>) -> Option<User> {
        sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
            .fetch_optional(pool)
            .await
            .expect("Cannot load user")
    }
}
