use actix_web::web::ServiceConfig;
use chrono::{DateTime, Utc};
use serde::Deserialize;

mod dashboard;
mod member;
mod membership;

#[derive(Deserialize)]
pub struct MemberRequest {
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub street: Option<String>,
    pub house_nr: Option<String>,
    pub zip: Option<String>,
    pub city: Option<String>,
    pub iban: Option<String>,
    pub membership_fee: Option<f32>,
}

#[derive(Deserialize)]
pub struct CreateMembershipPaymentRequest {
    pub year: i32,
    pub member_id: i32,
    pub paid_at: DateTime<Utc>,
}

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(member::create)
        .service(member::list)
        .service(member::get_member)
        .service(member::update_member)
        .service(member::list_left)
        .service(member::leave)
        .service(membership::create_membership_payment)
        .service(membership::get_paid_memberships)
        .service(membership::get_open_membership_fees)
        .service(membership::get_paid_memberships_for_user)
        .service(membership::get_membership_years)
        .service(dashboard::member_count)
        .service(dashboard::yearly_earnings);
}
