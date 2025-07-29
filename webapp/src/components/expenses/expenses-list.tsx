"use client";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import EntityList, { EntityListRowAction } from "../entity-list";
import { Expense } from "@/types/api/expense";
import TransactionChip from "./transaction-chip";
import ExpenseStatusChip from "./expense-status-chip";
import { useTranslations } from "next-intl";

interface ExpensesListProps {
  expenses: Expense[];
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  page: number;
  setPage: (page: number) => void;
  loading: boolean;
  rowCount: number;
}

const ExpensesList = ({
  expenses,
  pageSize,
  setPageSize,
  page,
  setPage,
  loading,
  rowCount,
}: ExpensesListProps) => {
  const router = useRouter();
  const t = useTranslations();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: t("generic.id"),
    },
    {
      field: "name",
      headerName: t("labels.expense.expense.name"),
    },
    {
      field: "description",
      headerName: t("labels.expense.expense.description"),
    },
    {
      field: "total_amount",
      headerName: t("labels.expense.expense.totalAmount"),
      valueFormatter: (value) => `${(value ?? 0) / 100}€`,
    },
    {
      field: "status",
      headerName: t("labels.expense.expense.status"),
      renderCell: ({ row }) => <ExpenseStatusChip status={row.status} />,
    },
    {
      field: "expense_transaction",
      headerName: t("labels.expense.expense.expenseTransaction"),
      renderCell: ({ row }) =>
        row.expense_transaction ? (
          <TransactionChip value={row.expense_transaction} />
        ) : null,
    },
    {
      field: "balancing_transaction",
      headerName: t("labels.expense.expense.balancingTransaction"),
      renderCell: ({ row }) =>
        row.balancing_transaction ? (
          <TransactionChip value={row.balancing_transaction} />
        ) : null,
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: t("generic.details"),
      onClick: (row) => router.push(`/backend/expenses/expenses/${row.id}`),
      color: "primary",
    },
  ];

  return (
    <EntityList
      columns={cols}
      rows={expenses}
      loading={loading}
      page={page}
      pageSize={pageSize}
      setPage={setPage}
      setPageSize={setPageSize}
      paginationMode="server"
      rowCount={rowCount}
      rowActions={rowActions}
    />
  );
};

export default ExpensesList;
