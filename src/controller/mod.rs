use actix_web::web::ServiceConfig;

mod default;

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(default::default);
}
