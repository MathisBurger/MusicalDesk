use bcrypt::{hash, DEFAULT_COST};
use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::{Pool, Postgres};
use stripe::{CheckoutSessionId, Customer};

use crate::controller::auth::RegisterRequest;

use super::generic::{Error, UserRole};

#[derive(Clone, Serialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    #[serde(skip_serializing)]
    pub password: String,
    pub roles: Vec<String>,
    pub email: Option<String>,
    #[serde(skip_serializing)]
    pub customer_id: Option<String>,
    pub current_checkout_session: Option<String>,
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

    pub async fn create_customer_account(
        req: &RegisterRequest,
        db: &Pool<Postgres>,
    ) -> Result<User, Error> {
        let hash = hash(req.password.clone(), DEFAULT_COST).unwrap();
        let roles: [String; 1] = [UserRole::ShopCustomer.to_string()];
        sqlx::query_as!(User, "INSERT INTO users (username, password, roles, email) VALUES ($1, $2, $3, $1) RETURNING *", req.email, hash, &roles)
            .fetch_one(db)
            .await
            .map_err(|_x| Error::AlreadyExists)
    }

    pub async fn update_stripe_customer_reference(
        user_id: i32,
        customer: &Customer,
        db: &Pool<Postgres>,
    ) -> User {
        sqlx::query_as!(
            User,
            "UPDATE users SET customer_id = $1 WHERE id = $2 RETURNING *",
            customer.id.as_str(),
            user_id
        )
        .fetch_one(db)
        .await
        .expect("Cannot update customer reference")
    }

    pub async fn update_stripe_checkout_session_reference(
        user_id: i32,
        session_id: &CheckoutSessionId,
        db: &Pool<Postgres>,
    ) -> User {
        sqlx::query_as!(
            User,
            "UPDATE users SET current_checkout_session = $1 WHERE id = $2 RETURNING *",
            session_id.as_str(),
            user_id
        )
        .fetch_one(db)
        .await
        .expect("Cannot update customer reference")
    }
}
