use std::str::FromStr;

use chrono::Utc;
use cron::Schedule;
use sqlx::{Pool, Postgres};
use tokio::time::sleep;

use crate::models::event::checkout_session::DbCheckoutSession;

pub async fn session_cleanup_cron_scheduler(db: &Pool<Postgres>) {
    let expression = "0 * * * * *";
    let schedule = Schedule::from_str(expression).unwrap();

    let mut upcoming = schedule.upcoming(Utc);

    while let Some(datetime) = upcoming.next() {
        let now = Utc::now();
        let delay = (datetime - now).to_std().unwrap();
        sleep(delay).await;
        DbCheckoutSession::delete_pending(db).await;
    }
}
