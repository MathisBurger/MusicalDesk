use account::AccountType;
use chrono::{DateTime, Duration, Utc};
use serde::Serialize;
use sqlx::Row;
use sqlx::{postgres::PgRow, prelude::FromRow, PgPool};

use crate::controller::expense::dashboard::TimePeriod;

pub mod account;
pub mod budget;
pub mod category;
pub mod expense;
pub mod report;
pub mod transaction;

// All Dashboard queries

#[derive(FromRow, Serialize)]
pub struct ScatterTransaction {
    pub id: i32,
    pub amount: i32,
    pub timestamp: DateTime<Utc>,
}

impl ScatterTransaction {
    pub async fn find_last_100(db: &PgPool) -> Vec<ScatterTransaction> {
        sqlx::query_as!(ScatterTransaction, "SELECT id, amount, timestamp FROM expense_transactions ORDER BY timestamp DESC LIMIT 100")
            .fetch_all(db)
            .await
            .unwrap()
    }
}

pub async fn get_total_money_spent(period: TimePeriod, db: &PgPool) -> i64 {
    let from = get_from_date(period);
    let row = sqlx::query!("SELECT SUM(total_amount) as amount FROM expense_expenses e JOIN expense_transactions t ON e.balancing_transaction_id = t.id WHERE t.timestamp > $1", from)
        .fetch_one(db)
        .await
        .unwrap();
    row.amount.unwrap_or(0)
}

pub async fn get_money_balance(db: &PgPool) -> i64 {
    let row = sqlx::query!(
        "SELECT SUM(balance) as amount FROM expense_accounts WHERE account_type = $1",
        AccountType::MONEY.to_string()
    )
    .fetch_one(db)
    .await
    .unwrap();
    row.amount.unwrap_or(0)
}

pub async fn get_total_money_earned(period: TimePeriod, db: &PgPool) -> i64 {
    let from = get_from_date(period);
    let row = sqlx::query!(
        "SELECT SUM(amount) as amount FROM expense_transactions t JOIN expense_accounts a1 ON t.from_account_id = a1.id JOIN expense_accounts a2 ON t.to_account_id = a2.id WHERE t.timestamp > $1 AND a1.account_type IN ($2, $3) AND a2.account_type = $4",
        from,
        AccountType::FLOW.to_string(),
        AccountType::FOREIGN.to_string(),
        AccountType::MONEY.to_string()
    )
        .fetch_one(db)
        .await
        .unwrap();
    row.amount.unwrap_or(0)
}

pub async fn get_total_transactions_created(period: TimePeriod, db: &PgPool) -> i64 {
    let from = get_from_date(period);
    let row = sqlx::query!(
        "SELECT COUNT(*) as amount FROM expense_transactions t WHERE t.timestamp > $1",
        from
    )
    .fetch_one(db)
    .await
    .unwrap();
    row.amount.unwrap_or(0)
}

#[derive(FromRow, Serialize)]
pub struct MoneyOverTime {
    pub label: i32,
    pub value: i64,
}

pub async fn get_money_spent_over_time(period: TimePeriod, db: &PgPool) -> Vec<MoneyOverTime> {
    let from = get_from_date(period.clone());
    let label_func = get_label_func(period);
    let query = format!("SELECT SUM(total_amount) as value, {} as label FROM expense_expenses e JOIN expense_transactions t ON e.balancing_transaction_id = t.id WHERE t.timestamp > $1 GROUP BY label", label_func);
    sqlx::query_as::<_, MoneyOverTime>(&query)
        .bind(from)
        .fetch_all(db)
        .await
        .unwrap()
}

#[derive(FromRow, Serialize)]
pub struct MoneyOverTimeByCategory {
    pub time: i32,
    pub value: i64,
    pub category_id: Option<i32>,
}

pub async fn get_money_spent_over_time_by_category(
    period: TimePeriod,
    db: &PgPool,
) -> Vec<MoneyOverTimeByCategory> {
    let from = get_from_date(period.clone());
    let label_func = get_label_func(period);
    let query = format!("SELECT SUM(total_amount) as value, {} as time, t.category_id as category_id FROM expense_expenses e JOIN expense_transactions t ON e.balancing_transaction_id = t.id WHERE t.timestamp > $1 GROUP BY time, t.category_id", label_func);
    sqlx::query_as::<_, MoneyOverTimeByCategory>(&query)
        .bind(from)
        .fetch_all(db)
        .await
        .unwrap()
}

fn get_from_date(period: TimePeriod) -> DateTime<Utc> {
    match period {
        TimePeriod::Week => Utc::now() - Duration::days(7),
        TimePeriod::Month => Utc::now() - Duration::days(30),
        TimePeriod::Year => Utc::now() - Duration::days(365),
        TimePeriod::FiveYear => Utc::now() - Duration::days(365 * 5),
    }
}

fn get_label_func(period: TimePeriod) -> &'static str {
    match period {
        TimePeriod::Week => "EXTRACT(ISODOW FROM t.timestamp)::INT",
        TimePeriod::Month => "EXTRACT(DAY FROM t.timestamp)::INT",
        TimePeriod::Year => "EXTRACT(MONTH FROM t.timestamp)::INT",
        TimePeriod::FiveYear => "EXTRACT(YEAR FROM t.timestamp)::INT",
    }
}
