ALTER TABLE users
ADD COLUMN customer_id TEXT;

ALTER TABLE events
ADD COLUMN product_id TEXT;

ALTER TABLE events
ADD COLUMN price_id TEXT;
