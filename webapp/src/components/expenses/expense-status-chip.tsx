"use client";
import { ExpenseStatus } from "@/types/api/expense";
import { CssVarsProvider, extendTheme } from "@mui/joy";
import { Chip } from "@mui/joy";
import { useMemo } from "react";

interface ExpenseStatusChipProps {
  status: ExpenseStatus;
}

const theme = extendTheme({
  components: {
    JoyChip: {
      styleOverrides: {
        root: {
          color: "white",
        },
        action: {
          background: "none",
        },
      },
    },
  },
});

const ExpenseStatusChip = ({ status }: ExpenseStatusChipProps) => {
  const color = useMemo<string>(() => {
    switch (status) {
      case ExpenseStatus.REQUEST:
        return "purple";
      case ExpenseStatus.DENIED:
        return "red";
      case ExpenseStatus.ACCEPTED:
        return "green";
    }
  }, [status]);

  return (
    <CssVarsProvider theme={theme}>
      <Chip sx={{ background: `${color}` }}>{status}</Chip>
    </CssVarsProvider>
  );
};

export default ExpenseStatusChip;
