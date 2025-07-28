// ACCOUNT
//

import { Image } from "./generic";

export enum AccountType {
  MONEY = "MONEY",
  MATERIAL = "MATERIAL",
  FLOW = "FLOW",
  FOREIGN = "FOREIGN",
}

export interface CreateAccountRequest {
  name: string;
  owner_name: string;
  iban?: string;
  account_type: AccountType;
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
  account_type: AccountType;
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

export interface ExpenseRequest {
  name: string;
  description: string;
  total_amount: number;
}

export interface ExpenseTransactionRequest {
  amount: number;
  from_account_id: number;
  to_account_id: number;
  category_id?: number;
}

export interface AcceptExpenseRequest {
  amount: number;
  money_account_id: number;
  from_account_id: number;
  to_account_id: number;
  category_id?: number;
}

export enum ExpenseStatus {
  REQUEST = "REQUEST",
  DENIED = "DENIED",
  ACCEPTED = "ACCEPTED",
}

export interface Expense {
  id: number;
  expense_transaction?: Transaction;
  balancing_transaction?: Transaction;
  name: string;
  description: string;
  status: ExpenseStatus;
  total_amount: number;
}

export interface ExpenseWithImages {
  expense: Expense;
  images: Image[];
}

// REPORT

export interface CreateReportRequest {
  name: string;
  start_date: string;
  end_date: string;
}

export interface Report {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

export interface ReportCategorySumup {
  category?: MinimalCategory;
  sum: number;
}

// DASHBOARD

export interface ScatterTransaction {
  id: number;
  amount: number;
  timestamp: string;
}

export enum TimePeriod {
  Week = "week",
  Month = "month",
  Year = "year",
  FiveYears = "five_year",
}

export interface TotalResponse {
  total: number;
}

export interface MoneyOverTime {
  label: number;
  value: number;
}

export interface MoneyOverTimeByCategory {
  time: number;
  value: number;
  category?: Category;
}

export const week = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

export const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
