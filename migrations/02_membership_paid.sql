CREATE TABLE IF NOT EXISTS membership_paid (
    year INTEGER NOT NULL,
    member_id INTEGER NOT NULL REFERENCES members (id),
    paid_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        PRIMARY KEY (year, member_id)
);
