use actix_web::web::ServiceConfig;

pub mod account;

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(account::get_accounts)
        .service(account::get_account)
        .service(account::create_account)
        .service(account::update_account)
        .service(account::get_account_transactions);
}
