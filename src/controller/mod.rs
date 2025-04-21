use actix_web::web::ServiceConfig;

pub mod auth;
mod default;
pub mod event;
mod image;
pub mod membership;
pub mod shop;
pub mod user;

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(default::default)
        .service(auth::login)
        .service(auth::logout)
        .service(user::get_current_user)
        .service(user::get_backend_users)
        .service(user::get_backend_user)
        .service(user::create_backend_user)
        .service(user::update_backend_user)
        .service(user::update_backend_user_password)
        .service(user::get_user)
        .service(image::get_image)
        .service(image::upload_image);

    membership::init_controllers(cfg);
    shop::init_controllers(cfg);
    event::init_controllers(cfg);
}
