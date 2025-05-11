"use client";
import { Transaction } from "@/types/api/expense";
import { CssVarsProvider, extendTheme } from "@mui/joy";
import { Chip } from "@mui/joy";
import { useRouter } from "next/navigation";

interface TransactionChipProps {
  value: Transaction;
}

const theme = extendTheme({
  components: {
    JoyChip: {
      styleOverrides: {
        root: {
          color: "white",
          "&:hover": {
            color: "var(--joy-palette-text-primary)",
          },
        },
        action: {
          background: "none",
        },
      },
    },
  },
});

const TransactionChip = ({ value }: TransactionChipProps) => {
  const router = useRouter();

  return (
    <CssVarsProvider theme={theme}>
      <Chip
        onClick={() =>
          router.push(`/backend/expenses/transactions/${value.id}`)
        }
      >
        {value.id}
      </Chip>
    </CssVarsProvider>
  );
};

export default TransactionChip;
