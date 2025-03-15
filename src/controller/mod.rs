use actix_web::web::ServiceConfig;

mod auth;
mod default;
mod user;

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(default::default)
        .service(auth::login)
        .service(user::get_current_user);
}
