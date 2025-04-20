use super::CreateMembershipPaymentRequest;
use actix_web::{
    get, post,
    web::{Data, Json, Path},
    HttpResponse,
};

use crate::{
    models::{
        generic::{Error, UserRole},
        member::Member,
        membership_paid::MembershipPaid,
        user::User,
    },
    AppState,
};

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
    let member_ids: Vec<i32> = paid_memberships
        .iter()
        .map(|membership| membership.member_id)
        .collect();
    let members = Member::find_by_ids(member_ids, &state.database).await;
    Ok(HttpResponse::Ok().json(members))
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
