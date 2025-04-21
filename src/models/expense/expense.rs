pub struct Expense {
    pub id: i32,
    pub expense_transaction_id: Option<i32>,
    pub balancing_transaction_id: Option<i32>,
    pub name: String,
    pub description: String,
    pub budget_id: Option<i32>,
    pub is_request: bool,
    pub total_amount: i32,
}
