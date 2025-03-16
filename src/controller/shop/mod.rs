use actix_web::web::ServiceConfig;

mod public_info;

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(public_info::get_current_events)
        .service(public_info::get_event);
}
