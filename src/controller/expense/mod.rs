use actix_web::web::ServiceConfig;

pub mod account;
pub mod budget;
pub mod category;
pub mod expense;
pub mod report;
pub mod transaction;

pub fn init_controllers(cfg: &mut ServiceConfig) {
    cfg.service(account::get_accounts)
        .service(account::get_account)
        .service(account::create_account)
        .service(account::update_account)
        .service(account::get_account_transactions)
        .service(category::get_categories)
        .service(category::get_category)
        .service(category::get_category_transactions)
        .service(category::create_category)
        .service(category::update_category)
        .service(budget::create_budget)
        .service(budget::get_all_budgets)
        .service(budget::get_budget)
        .service(budget::update_budget)
        .service(budget::get_budget_expenses)
        .service(transaction::create_transaction)
        .service(transaction::get_transaction)
        .service(transaction::get_transactions)
        .service(expense::request_expense)
        .service(expense::update_expense)
        .service(expense::get_expense)
        .service(expense::get_expenses)
        .service(expense::deny_expense)
        .service(expense::accept_expense)
        .service(expense::add_files_to_expense)
        .service(report::create_report)
        .service(report::get_reports)
        .service(report::get_report)
        .service(report::get_report_transactions)
        .service(report::get_report_category_sumups);
}
