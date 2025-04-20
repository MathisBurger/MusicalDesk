use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use serde::Serialize;
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
