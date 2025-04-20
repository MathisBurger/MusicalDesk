use actix_web::web::ServiceConfig;

pub mod auth;
mod default;
pub mod event;
mod image;
pub mod member;
pub mod membership;
mod shop;
mod ticket;
mod user;

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(default::default)
        .service(auth::login)
        .service(auth::logout)
        .service(auth::register_as_customer)
        .service(user::get_current_user)
        .service(member::create)
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
        .service(image::get_image)
        .service(image::upload_image)
        .service(event::create_event)
        .service(event::get_events)
        .service(event::get_event)
        .service(event::update_event)
        .service(ticket::create_tickets_for_event)
        .service(ticket::get_tickets_for_event)
        .service(ticket::get_user_ticket);

    shop::init_controllers(cfg);
}
