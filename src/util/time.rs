use std::time::{SystemTime, UNIX_EPOCH};

pub fn unix_timestamp_plus_3_days() -> u64 {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");

    now.as_secs() + (3 * 24 * 60 * 60)
}
