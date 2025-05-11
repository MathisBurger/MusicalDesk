"use client";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import EntityList from "../entity-list";
import { Expense } from "@/types/api/expense";
import TransactionChip from "./transaction-chip";

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

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "description",
      headerName: "Description",
    },
    {
      field: "total_amount",
      headerName: "Total amount",
    },
    {
      field: "expense_transaction",
      headerName: "Transaction (Expense)",
      renderCell: ({ row }) =>
        row.expense_transaction ? (
          <TransactionChip value={row.expense_transaction} />
        ) : null,
    },
    {
      field: "balancing_transaction",
      headerName: "Transaction (Balancing)",
      renderCell: ({ row }) =>
        row.balancing_transaction ? (
          <TransactionChip value={row.balancing_transaction} />
        ) : null,
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
    />
  );
};

export default ExpensesList;
