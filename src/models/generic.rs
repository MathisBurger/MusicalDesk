use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use serde::Serialize;
use sqlx::{postgres::PgRow, query, query_as, FromRow, Postgres};
use sqlx::{Encode, PgPool, Type};
use sqlx::{QueryBuilder, Row};
use std::error::Error as ErrorTrait;
use thiserror::Error;

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum UserRole {
    Admin,
    MemberAdmin,
    EventAdmin,
    // Default role for backend users (not for shop users)
    Default,
    ShopCustomer,
    TicketInvalidator,
    Accountant,
}

pub const BACKEND_ROLES: [UserRole; 3] =
    [UserRole::Admin, UserRole::EventAdmin, UserRole::MemberAdmin];

impl ToString for UserRole {
    fn to_string(&self) -> String {
        match self {
            Self::Admin => "admin".to_string(),
            Self::Default => "default".to_string(),
            Self::MemberAdmin => "member_admin".to_string(),
            Self::EventAdmin => "event_admin".to_string(),
            Self::ShopCustomer => "shop_customer".to_string(),
            Self::TicketInvalidator => "ticket_invalidator".to_string(),
            Self::Accountant => "accountant".to_string(),
        }
    }
}
impl TryFrom<&String> for UserRole {
    type Error = Error;
    fn try_from(value: &String) -> Result<Self, Self::Error> {
        match value.as_str() {
            "admin" => Ok(Self::Admin),
            "member_admin" => Ok(Self::MemberAdmin),
            "event_admin" => Ok(Self::EventAdmin),
            "shop_customer" => Ok(Self::ShopCustomer),
            "ticket_invalidator" => Ok(Self::TicketInvalidator),
            "accountant" => Ok(Self::Accountant),
            _ => Err(Error::BadRequest),
        }
    }
}

#[derive(Debug, Error)]
pub enum Error {
    #[error("ALREADY_EXISTS")]
    AlreadyExists,
    #[error("BAD_REQUEST")]
    BadRequest,
    #[error("NOT_FOUND")]
    NotFound,
    #[error("UNAUTHORIZED")]
    Unauthorized,
    #[error("FORBIDDEN")]
    Forbidden,
    #[error("INTERNAL_SERVER_ERROR")]
    InternalServerError { source: Box<dyn ErrorTrait> },
}

#[derive(Serialize)]
struct ResponseBody {
    message: String,
}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        let response_body = ResponseBody {
            message: format!("{}", self),
        };
        HttpResponse::build(self.status_code()).json(response_body)
    }

    /// Map http statuscodes to the corresponding [`Error`] variants
    fn status_code(&self) -> StatusCode {
        use Error::*;
        match self {
            AlreadyExists => StatusCode::CONFLICT,
            BadRequest => StatusCode::BAD_REQUEST,
            Forbidden => StatusCode::FORBIDDEN,
            InternalServerError { source: _ } => StatusCode::INTERNAL_SERVER_ERROR,
            NotFound => StatusCode::NOT_FOUND,
            Unauthorized => StatusCode::UNAUTHORIZED,
        }
    }
}

impl From<Box<dyn ErrorTrait>> for Error {
    fn from(v: Box<dyn ErrorTrait>) -> Self {
        Self::InternalServerError { source: v }
    }
}

pub struct Paginated<T> {
    pub results: Vec<T>,
    pub total: i64,
}

impl<T> Paginated<T>
where
    T: for<'r> FromRow<'r, PgRow> + Send + Unpin,
{
    pub async fn create_paginated_query<U>(
        select: &str,
        table: &str,
        where_clause: Option<&str>,
        page: i32,
        page_size: i32,
        params: Vec<U>,
        db: &PgPool,
    ) -> Self
    where
        U: Encode<'static, sqlx::Postgres> + Type<sqlx::Postgres> + Clone + Send + Sync + 'static,
    {
        // Build the base query with optional where clause
        let base_query = match where_clause {
            Some(clause) => format!("FROM {} WHERE {}", table, clause),
            None => format!("FROM {}", table),
        };

        // Create the select SQL query with LIMIT and OFFSET
        let select_sql = format!(
            "SELECT {} {} LIMIT {} OFFSET {}",
            select,
            base_query,
            page_size,
            page_size * page
        );

        // Create the count query to get the total number of rows
        let count_sql = format!("SELECT COUNT(*) AS count {}", base_query);

        // Create query objects
        let mut select_query = query_as::<sqlx::Postgres, T>(&select_sql);
        let mut count_query = query(&count_sql);

        // Bind parameters to the queries
        for param in &params {
            select_query = select_query.bind(param.clone());
            count_query = count_query.bind(param.clone());
        }

        // Execute the select query
        let results = select_query
            .fetch_all(db)
            .await
            .expect("Cannot execute select");

        // Execute the count query
        let count_row: PgRow = count_query.fetch_one(db).await.expect("Cannot fetch count");

        // Extract the total count from the count query
        let total: i64 = count_row.get("count");

        // Return the paginated result
        Paginated { results, total }
    }
}
