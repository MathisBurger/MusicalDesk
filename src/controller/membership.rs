use actix_web::{
    get, post,
    web::{Data, Json, Path},
    HttpResponse,
};
use chrono::{DateTime, Utc};
use serde::Deserialize;

use crate::{
    models::{
        generic::{Error, UserRole},
        membership_paid::MembershipPaid,
        user::User,
    },
    AppState,
};

#[derive(Deserialize)]
pub struct CreateMembershipPaymentRequest {
    pub year: i32,
    pub member_id: i32,
    pub paid_at: DateTime<Utc>,
}

#[get("/memberships/years")]
pub async fn get_membership_years(
    user: User,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let years = MembershipPaid::find_membership_years(&state.database).await;
    Ok(HttpResponse::Ok().json(years))
}

#[get("/memberships/years/{year}/unpaid")]
pub async fn get_open_membership_fees(
    user: User,
    query: Path<(i32,)>,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let unpaid_memberships = MembershipPaid::find_open_by_year(query.0, &state.database).await;
    Ok(HttpResponse::Ok().json(unpaid_memberships))
}

#[get("/memberships/years/{year}/paid")]
pub async fn get_paid_memberships(
    user: User,
    query: Path<(i32,)>,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let paid_memberships = MembershipPaid::find_by_year(query.0, &state.database).await;
    Ok(HttpResponse::Ok().json(paid_memberships))
}

#[get("/memberships/members/{member_id}/paid")]
pub async fn get_paid_memberships_for_user(
    user: User,
    query: Path<(i32,)>,
    state: Data<AppState>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let paid_memberships = MembershipPaid::find_by_member_id(query.0, &state.database).await;
    Ok(HttpResponse::Ok().json(paid_memberships))
}

#[post("/memberships")]
pub async fn create_membership_payment(
    user: User,
    state: Data<AppState>,
    data: Json<CreateMembershipPaymentRequest>,
) -> Result<HttpResponse, Error> {
    if !user.has_role_or_admin(UserRole::MemberAdmin) {
        return Err(Error::Forbidden);
    }
    let payment = MembershipPaid::create(&data, &state.database).await?;
    Ok(HttpResponse::Ok().json(payment))
}
