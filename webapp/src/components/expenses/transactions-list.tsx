"use client";
import { Transaction } from "@/hooks/queries/expense/useAccountTransactionsQuery";
import { Chip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import EntityList from "../entity-list";

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
      field: "from_account",
      headerName: "From (Account)",
      renderCell: ({ value }: GridRenderCellParams) => (
        <Chip
          onClick={() => router.push(`/backend/expenses/accounts/${value.id}`)}
          label={value.name}
        />
      ),
    },
    {
      field: "to_account",
      headerName: "To (Account)",
      renderCell: ({ value }: GridRenderCellParams) => (
        <Chip
          onClick={() => router.push(`/backend/expenses/accounts/${value.id}`)}
          label={value.name}
        />
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
        value ? (
          <Chip
            onClick={() =>
              router.push(`/backend/expenses/categories/${value.id}`)
            }
            sx={{ background: `#${value.hex_color}`, color: "white" }}
            label={value.name}
          />
        ) : null,
    },
    {
      field: "is_money_transactions",
      headerName: "Money transaction?",
      type: "boolean",
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
    />
  );
};

export default TransactionsList;
