"use client";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import EntityList, { EntityListCol, EntityListRowAction } from "../entity-list";
import CategoryChip from "./category-chip";
import {
  MinimalAccount,
  MinimalCategory,
  Transaction,
} from "@/types/api/expense";
import AccountChip from "./account-chip";
import { useTranslations } from "next-intl";

interface TransactionsListProps {
  transactions: Transaction[];
  pageSize?: number;
  setPageSize?: (pageSize: number) => void;
  page?: number;
  setPage?: (page: number) => void;
  loading: boolean;
  rowCount: number;
}

const TransactionsList = ({
  transactions,
  pageSize,
  setPageSize,
  page,
  setPage,
  loading,
  rowCount,
}: TransactionsListProps) => {
  const router = useRouter();
  const t = useTranslations();

  const cols: EntityListCol[] = [
    {
      field: "id",
      headerName: t("generic.id"),
      tooltip: t("tooltips.id"),
    },
    {
      field: "amount",
      headerName: t("labels.expense.transaction.amount"),
      valueFormatter: (value) => `${(value ?? 0) / 100}€`,
      tooltip: t("tooltips.expense.transaction.amount"),
    },
    {
      field: "name",
      headerName: t("labels.expense.transaction.name"),
      tooltip: t("tooltips.expense.transaction.name"),
    },
    {
      field: "from_account",
      headerName: t("labels.expense.transaction.fromAccount"),
      renderCell: ({ value }: GridRenderCellParams) => (
        <AccountChip account={value as MinimalAccount} />
      ),
      tooltip: t("tooltips.expense.transaction.fromAccount"),
    },
    {
      field: "to_account",
      headerName: t("labels.expense.transaction.toAccount"),
      renderCell: ({ value }: GridRenderCellParams) => (
        <AccountChip account={value as MinimalAccount} />
      ),
      tooltip: t("tooltips.expense.transaction.toAccount"),
    },
    {
      field: "timestamp",
      headerName: t("labels.expense.transaction.timestamp"),
      tooltip: t("tooltips.expense.transaction.timestamp"),
    },
    {
      field: "category",
      headerName: t("labels.expense.transaction.category"),
      renderCell: ({ value }: GridRenderCellParams) =>
        value ? <CategoryChip value={value as MinimalCategory} /> : null,
      tooltip: t("tooltips.expense.transaction.category"),
    },
    {
      field: "is_money_transaction",
      headerName: t("labels.expense.transaction.isMoneyTransaction"),
      type: "boolean",
      tooltip: t("tooltips.expense.transaction.isMoneyTransaction"),
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: t("generic.details"),
      onClick: (row) => router.push(`/backend/expenses/transactions/${row.id}`),
      color: "primary",
    },
  ];

  return (
    <EntityList
      columns={cols}
      rows={transactions}
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

export default TransactionsList;
