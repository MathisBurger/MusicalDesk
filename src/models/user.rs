use sqlx::{Pool, Postgres};

use super::generic::UserRole;

pub struct User {
    pub id: i32,
    pub username: String,
    pub password: String,
    pub roles: Vec<String>,
}

impl User {
    fn has_role(&self, role: UserRole) -> bool {
        self.roles.contains(&role.to_string())
    }

    pub async fn get_by_username(username: &String, pool: &Pool<Postgres>) -> Option<User> {
        sqlx::query_as!(User, "SELECT * FROM users WHERE username = $1", username)
            .fetch_optional(pool)
            .await
            .expect("Cannot load users")
    }
}
