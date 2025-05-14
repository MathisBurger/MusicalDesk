"use client";
import { Chip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import EntityList, { EntityListRowAction } from "../entity-list";
import CategoryChip from "./category-chip";
import {
  MinimalAccount,
  MinimalCategory,
  Transaction,
} from "@/types/api/expense";
import AccountChip from "./account-chip";

interface TransactionsListProps {
  transactions: Transaction[];
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  page: number;
  setPage: (page: number) => void;
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

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "amount",
      headerName: "Amount",
    },
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "from_account",
      headerName: "From (Account)",
      renderCell: ({ value }: GridRenderCellParams) => (
        <AccountChip account={value as MinimalAccount} />
      ),
    },
    {
      field: "to_account",
      headerName: "To (Account)",
      renderCell: ({ value }: GridRenderCellParams) => (
        <AccountChip account={value as MinimalAccount} />
      ),
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      type: "dateTime",
      valueGetter: ({ value }) => new Date(value),
    },
    {
      field: "category",
      headerName: "Category",
      renderCell: ({ value }: GridRenderCellParams) =>
        value ? <CategoryChip value={value as MinimalCategory} /> : null,
    },
    {
      field: "is_money_transactions",
      headerName: "Money transaction?",
      type: "boolean",
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: "Details",
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
