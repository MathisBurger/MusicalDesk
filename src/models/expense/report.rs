use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::{Executor, PgPool, Postgres};

use crate::controller::expense::report::CreateReportRequest;

#[derive(Serialize)]
pub struct Report {
    pub id: i32,
    pub name: String,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
}

#[derive(Serialize)]
pub struct ReportCategorySumup {
    pub report_id: i32,
    pub category_id: i32,
    pub sum: i32,
}

impl Report {
    pub async fn find_all(db: &PgPool) -> Vec<Report> {
        sqlx::query_as!(Report, "SELECT * FROM expense_reports")
            .fetch_all(db)
            .await
            .unwrap()
    }

    pub async fn find_by_id(id: i32, db: &PgPool) -> Option<Report> {
        sqlx::query_as!(Report, "SELECT * FROM expense_reports WHERE id = $1", id)
            .fetch_optional(db)
            .await
            .unwrap()
    }

    pub async fn create<'a, E>(req: &CreateReportRequest, db: &mut E) -> Report
    where
        for<'c> &'c mut E: Executor<'c, Database = Postgres>,
    {
        sqlx::query_as!(Report, "INSERT INTO expense_reports (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING *", req.name, req.start_date, req.end_date)
            .fetch_one(db)
            .await
            .unwrap()
    }

    pub async fn create_transactions_mapping<'a, E>(report: &Report, db: &mut E)
    where
        for<'c> &'c mut E: Executor<'c, Database = Postgres>,
    {
        sqlx::query!("INSERT INTO expense_reports_transactions (report_id, transaction_id) SELECT $1, id FROM expense_transactions WHERE timestamp BETWEEN $2 AND $3 ", report.id, report.start_date.clone(), report.end_date.clone())
            .execute(db)
            .await
        .unwrap();
    }
}

impl ReportCategorySumup {
    pub async fn find_by_report(report_id: i32, db: &PgPool) -> Vec<ReportCategorySumup> {
        sqlx::query_as!(
            ReportCategorySumup,
            "SELECT * FROM expense_reports_category_sumup WHERE report_id = $1",
            report_id
        )
        .fetch_all(db)
        .await
        .unwrap()
    }

    pub async fn create_in_range<'a, E>(
        report_id: i32,
        start_date: &DateTime<Utc>,
        end_date: &DateTime<Utc>,
        db: &mut E,
    ) -> Vec<ReportCategorySumup>
    where
        for<'c> &'c mut E: Executor<'c, Database = Postgres>,
    {
        sqlx::query_as!(ReportCategorySumup, "INSERT INTO expense_reports_category_sumup (report_id, category_id, sum) SELECT $1, category_id, SUM(amount) FROM expense_transactions WHERE timestamp BETWEEN $2 AND $3 GROUP BY category_id RETURNING *", report_id, start_date, end_date)
            .fetch_all(db)
            .await
            .unwrap()
    }
}
