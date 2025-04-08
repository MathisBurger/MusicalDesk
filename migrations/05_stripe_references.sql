ALTER TABLE users
ADD COLUMN customer_id TEXT;

ALTER TABLE events
ADD COLUMN product_id TEXT;

ALTER TABLE events
ADD COLUMN price_id TEXT;

CREATE TABLE IF NOT EXISTS checkout_sessions (
    session_id TEXT NOT NULL PRIMARY KEY,
    active_until TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        session_secret VARCHAR(255) UNIQUE NOT NULL
);

ALTER TABLE tickets
ADD COLUMN locked_in_checkout_session TEXT REFERENCES checkout_sessions (session_id) ON DELETE SET NULL;

ALTER TABLE users
ADD COLUMN current_checkout_session TEXT REFERENCES checkout_sessions (session_id) ON DELETE SET NULL;
