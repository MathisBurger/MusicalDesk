CREATE TABLE IF NOT EXISTS expense_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hex_color VARCHAR(7) NOT NULL,
    is_income BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS expense_budgets (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES expense_categories (id),
    start_date TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        end_date TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        budget INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS expense_accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    iban VARCHAR(255),
    account_type VARCHAR(50) NOT NULL,
    balance INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS expense_transactions (
    id SERIAL NOT NULL PRIMARY KEY,
    amount INTEGER NOT NULL,
    from_account_id INTEGER NOT NULL REFERENCES expense_accounts (id),
    to_account_id INTEGER NOT NULL REFERENCES expense_accounts (id),
    timestamp TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category_id INTEGER REFERENCES expense_categories (id),
        is_money_transaction BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS expense_expenses (
    id SERIAL NOT NULL PRIMARY KEY,
    expense_transaction_id INTEGER REFERENCES expense_transactions (id),
    balancing_transaction_id INTEGER REFERENCES expense_transactions (id),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    status VARCHAR(255) NOT NULL,
    requestor_id INTEGER NOT NULL REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS expense_join_expense_budget (
    budget_id INTEGER NOT NULL REFERENCES expense_budgets (id),
    expense_id INTEGER NOT NULL REFERENCES expense_expenses (id),
    PRIMARY KEY (budget_id, expense_id)
);

CREATE TABLE IF NOT EXISTS expense_images (
    expense_id INTEGER NOT NULL REFERENCES expenses (id),
    image_id INTEGER NOT NULL REFERENCES images (id),
    PRIMARY KEY (expense_id, image_id)
);

CREATE TABLE IF NOT EXISTS expense_reports (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        end_date TIMESTAMP
    WITH
        TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS expense_reports_transactions (
    report_id INTEGER NOT NULL REFERENCES expense_reports (id),
    transaction_id INTEGER NOT NULL REFERENCES expense_transactions (id),
    PRIMARY KEY (report_id, transaction_id)
);

CREATE TABLE IF NOT EXISTS expense_reports_category_sumup (
    report_id INTEGER NOT NULL REFERENCES expense_reports (id),
    cat_key INTEGER NOT NULL,
    category_id INTEGER REFERENCES expense_categories (id),
    sum INTEGER NOT NULL,
    PRIMARY KEY (report_id, cat_key)
);

CREATE TABLE IF NOT EXISTS image_access (
    image_id INTEGER NOT NULL REFERENCES images (id),
    user_id INTEGER NOT NULL REFERENCES users (id),
    PRIMARY KEY (image_id, user_id)
);
