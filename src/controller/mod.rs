use actix_web::web::ServiceConfig;

mod auth;
mod default;
pub mod member;
mod user;

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(default::default)
        .service(auth::login)
        .service(user::get_current_user)
        .service(member::create)
        .service(member::list)
        .service(member::get_member)
        .service(member::update_member)
        .service(member::list_left)
        .service(member::leave);
}
