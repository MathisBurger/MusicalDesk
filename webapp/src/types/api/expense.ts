// ACCOUNT

export interface CreateAccountRequest {
  name: string;
  owner_name: string;
  iban: string;
  is_tracking_account: boolean;
}

export interface UpdateAccountRequest {
  name: string;
  owner_name: string;
  iban: string;
}

export interface Account {
  id: number;
  name: string;
  owner_name: string;
  iban: string;
  is_tracking_account: boolean;
  balance: number;
}

export interface MinimalAccount {
  id: number;
  name: string;
}

// BUDGET

export interface CreateBudgetRequest {
  name: string;
  category_id: number;
  start_date: string;
  end_date: string;
  budget: number;
}

export interface UpdateBudgetRequest {
  name: string;
  budget: number;
}

export interface Budget {
  id: number;
  name: string;
  category: MinimalCategory;
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
}

// CATEGORY

export interface CreateCategoryRequest {
  name: string;
  hex_color: string;
  is_income: boolean;
}

export interface UpdateCategoryRequest {
  name: string;
  hex_color: string;
}

export interface Category {
  id: number;
  name: string;
  hex_color: string;
  is_income: boolean;
}

export interface MinimalCategory {
  id: number;
  name: string;
  hex_color: string;
}

// TRANSACTION

export interface Transaction {
  id: number;
  amount: number;
  from_account: MinimalAccount;
  to_account: MinimalAccount;
  name: string;
  timestamp: string | Date;
  category?: MinimalCategory;
  is_money_transaction: boolean;
}

export interface CreateTransactionRequest {
  amount: number;
  from_account_id: number;
  to_account_id: number;
  name: string;
  category_id?: number;
  is_money_transaction: boolean;
}

// EXPENSE

export interface Expense {
  id: number;
  expense_transaction: Transaction;
  balancing_transaction: Transaction;
  name: string;
  description: string;
  is_request: boolean;
  total_amount: number;
}
