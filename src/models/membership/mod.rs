use sqlx::PgPool;

pub mod member;
pub mod membership_paid;

pub async fn get_member_count(db: &PgPool) -> i64 {
    sqlx::query!("SELECT COUNT(*) AS total FROM members WHERE left_at IS NULL")
        .fetch_one(db)
        .await
        .unwrap()
        .total
        .unwrap_or(0)
}

pub async fn get_total_earnings_this_year(db: &PgPool) -> f32 {
    sqlx::query!("SELECT SUM(membership_fee) AS sum FROM members WHERE left_at IS NULL AND joined_at < NOW() AND membership_fee IS NOT NULL")
        .fetch_one(db)
        .await
        .unwrap()
        .sum
        .unwrap_or(0_f32)
}
