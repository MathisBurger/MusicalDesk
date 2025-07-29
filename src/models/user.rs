use bcrypt::{hash, DEFAULT_COST};
use serde::Serialize;
use sqlx::{Pool, Postgres};
use stripe::{CheckoutSessionId, Customer};

use crate::{
    controller::{
        shop::customer::RegisterRequest,
        user::{CreateUserRequest, UpdateUserRequest},
    },
    models::generic::BACKEND_ROLES,
};

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
    #[serde(skip_serializing)]
    pub current_checkout_session: Option<String>,
    pub first_name: Option<String>,
    pub surname: Option<String>,
    pub function: Option<String>,
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

    pub async fn get_backend_users(db: &Pool<Postgres>) -> Vec<User> {
        let roles: Vec<String> = BACKEND_ROLES.iter().map(|role| role.to_string()).collect();
        sqlx::query_as!(User, "SELECT * FROM users WHERE roles && $1", &roles)
            .fetch_all(db)
            .await
            .expect("Cannot load all users")
    }

    pub async fn create_user(req: &CreateUserRequest, db: &Pool<Postgres>) -> Result<User, Error> {
        let hash = hash(req.password.clone(), DEFAULT_COST).unwrap();
        sqlx::query_as!(
            User,
            "INSERT INTO users (username, password, roles, first_name, surname, function) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            req.username,
            hash,
            &req.roles,
            req.first_name,
            req.surname,
            req.function
        )
        .fetch_one(db)
        .await
        .map_err(|_x| Error::BadRequest)
    }

    pub async fn update_user(
        id: i32,
        req: &UpdateUserRequest,
        db: &Pool<Postgres>,
    ) -> Option<User> {
        sqlx::query_as!(
            User,
            "UPDATE users SET roles = $1, first_name = $2, surname = $3, function = $4 WHERE id = $5 RETURNING *",
            &req.roles,
            req.first_name,
            req.surname,
            req.function,
            id
        )
        .fetch_optional(db)
        .await
        .expect("Cannot update user")
    }

    pub async fn update_password(
        id: i32,
        new_password: String,
        db: &Pool<Postgres>,
    ) -> Option<User> {
        let hash = hash(new_password, DEFAULT_COST).unwrap();
        sqlx::query_as!(
            User,
            "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
            hash,
            id
        )
        .fetch_optional(db)
        .await
        .expect("Cannot update user")
    }
}
