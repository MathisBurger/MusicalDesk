CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    street VARCHAR(255),
    house_nr VARCHAR(5),
    zip VARCHAR(5),
    city VARCHAR(255),
    iban VARCHAR(30),
    membership_fee REAL,
    joined_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        left_at TIMESTAMP
    WITH
        TIME ZONE
);
