use actix_web::web::ServiceConfig;

mod public_info;
mod shopping_cart;
mod stripe;

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(public_info::get_current_events)
        .service(public_info::get_event)
        .service(shopping_cart::get_shopping_cart)
        .service(shopping_cart::add_ticket_to_shopping_cart)
        .service(shopping_cart::cancel_ticket_reservations)
        .service(stripe::create_shopping_cart_payment_session);
}
