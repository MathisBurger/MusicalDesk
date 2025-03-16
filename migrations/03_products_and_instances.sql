CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    local_file_name VARCHAR(255) NOT NULL,
    private BOOLEAN NOT NULL,
    required_roles TEXT[]
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price REAL NOT NULL,
    tax_percentage REAL NOT NULL,
    image_id INTEGER REFERENCES images (id),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    active_from TIMESTAMP
    WITH
        TIME ZONE,
        active_until TIMESTAMP
    WITH
        TIME ZONE
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events (id),
    valid_until TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        invalidated BOOLEAN NOT NULL,
        invalidated_at TIMESTAMP WITH TIME ZONE
);
