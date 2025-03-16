CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    local_file_name VARCHAR(255) NOT NULL,
    private BOOLEAN NOT NULL,
    required_roles TEXT[]
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price REAL NOT NULL,
    tax_percentage REAL NOT NULL,
    image_id INTEGER REFERENCES images (id),
    active_from TIMESTAMP
    WITH
        TIME ZONE,
        active_until TIMESTAMP
    WITH
        TIME ZONE
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products (id),
    valid_until TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        invalidated BOOLEAN NOT NULL
);
