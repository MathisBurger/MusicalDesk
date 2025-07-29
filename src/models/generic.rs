use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use serde::Serialize;
use sqlx::{postgres::PgRow, FromRow, Postgres};
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
    ExpenseRequestor,
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
            Self::ExpenseRequestor => "expense_requestor".to_string(),
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
            "expense_requestor" => Ok(Self::ExpenseRequestor),
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

#[derive(Serialize)]
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
        order_by: Option<&str>,
        page: i32,
        page_size: i32,
        params: Vec<U>,
        db: &PgPool,
    ) -> Self
    where
        U: Encode<'static, sqlx::Postgres> + Type<sqlx::Postgres> + Clone + Send + Sync + 'static,
    {
        let mut query = format!("SELECT {} FROM {}", select, table);
        if let Some(clause) = where_clause {
            query = format!("{} WHERE {}", query, clause);
        }

        let mut count_query = format!("SELECT COUNT(*) AS count FROM {}", table);
        if let Some(clause) = where_clause {
            count_query = format!("{} WHERE {}", count_query, clause);
        }

        let mut select_qb = Self::convert_to_query_builder(query, params.clone());
        if let Some(order_by_real) = order_by {
            select_qb.push(format!(" ORDER BY {}", order_by_real));
        }
        select_qb
            .push(" LIMIT ")
            .push_bind(page_size)
            .push(" OFFSET ")
            .push_bind(page_size * page);

        let mut count_qb = Self::convert_to_query_builder(count_query, params);
        let results = select_qb
            .build_query_as::<T>()
            .fetch_all(db)
            .await
            .expect("Cannot execute select");

        let count_row: PgRow = count_qb
            .build()
            .fetch_one(db)
            .await
            .expect("Cannot fetch count");

        let total: i64 = count_row.get("count");

        Paginated { results, total }
    }

    fn convert_to_query_builder<U>(query: String, params: Vec<U>) -> QueryBuilder<'static, Postgres>
    where
        U: Encode<'static, sqlx::Postgres> + Type<sqlx::Postgres> + Clone + Send + Sync + 'static,
    {
        let split: Vec<&str> = query.split("$").collect();
        let mut qb = QueryBuilder::new(*split.get(0).unwrap());
        for index in 1..split.len() {
            let statement = split.get(index).unwrap();
            let statement_split = statement.split_once(" ").unwrap_or((statement, ""));
            let param_index: usize = statement_split.0.parse().unwrap();
            let param = params.get(param_index - 1).unwrap().clone();
            qb.push_bind(param);
            qb.push(format!(" {}", statement_split.1));
        }

        qb
    }
}
