use actix_web::web::ServiceConfig;

pub mod account;
pub mod category;

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(account::get_accounts)
        .service(account::get_account)
        .service(account::create_account)
        .service(account::update_account)
        .service(account::get_account_transactions)
        .service(category::get_categories)
        .service(category::create_category)
        .service(category::update_category)
        .service(category::delete_category);
}
