use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::{types::BigDecimal, Pool, Postgres};

use crate::controller::membership::CreateMembershipPaymentRequest;

use super::{super::generic::Error, member::Member};

#[derive(Serialize)]
pub struct MembershipPaid {
    pub year: i32,
    pub member_id: i32,
    pub paid_at: DateTime<Utc>,
}

impl MembershipPaid {
    pub async fn find_membership_years(db: &Pool<Postgres>) -> Vec<u32> {
        let rows = sqlx::query!(
                r#"
                WITH min_year AS (
                    SELECT EXTRACT(YEAR FROM MIN(joined_at)) AS start_year FROM members
                )
                SELECT generate_series(start_year::int, EXTRACT(YEAR FROM CURRENT_DATE)::int) AS year
                FROM min_year
                "#
            )
            .fetch_all(db)
            .await
            .expect("Cannot load years");

        rows.into_iter()
            .map(|row| row.year.unwrap() as u32)
            .collect()
    }

    pub async fn find_by_year(year: i32, db: &Pool<Postgres>) -> Vec<MembershipPaid> {
        sqlx::query_as!(
            MembershipPaid,
            "SELECT * FROM membership_paid WHERE year = $1",
            year
        )
        .fetch_all(db)
        .await
        .expect("Cannot load paid memberships")
    }

    pub async fn find_by_member_id(member_id: i32, db: &Pool<Postgres>) -> Vec<MembershipPaid> {
        sqlx::query_as!(
            MembershipPaid,
            "SELECT * FROM membership_paid WHERE member_id = $1",
            member_id
        )
        .fetch_all(db)
        .await
        .expect("Cannot load paid memberships")
    }

    pub async fn find_open_by_year(year: i32, db: &Pool<Postgres>) -> Vec<Member> {
        sqlx::query_as!(Member, "SELECT * FROM members WHERE (left_at IS NULL OR EXTRACT(YEAR FROM joined_at) > $1) AND EXTRACT(YEAR FROM joined_at) <= $1 AND membership_fee IS NOT NULL AND id NOT IN (SELECT member_id FROM membership_paid WHERE year = $2)", BigDecimal::from(year), year)
            .fetch_all(db)
            .await.expect("Cannot load members that have not paid")
    }

    pub async fn create(
        req: &CreateMembershipPaymentRequest,
        db: &Pool<Postgres>,
    ) -> Result<MembershipPaid, Error> {
        sqlx::query_as!(MembershipPaid, "INSERT INTO membership_paid (year, member_id, paid_at) VALUES ($1, $2, $3) RETURNING *", req.year, req.member_id, req.paid_at)
            .fetch_one(db)
            .await
            .map_err(|_x|Error::AlreadyExists)
    }
}
