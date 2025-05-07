"use client";
import { MinimalCategory } from "@/hooks/queries/expense/useAccountTransactionsQuery";
import { Category } from "@/hooks/queries/expense/useCategoriesQuery";
import { CssVarsProvider, extendTheme } from "@mui/joy";
import { Chip } from "@mui/joy";
import { useRouter } from "next/navigation";

interface CategoryChipProps {
  value: Category | MinimalCategory;
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

const CategoryChip = ({ value }: CategoryChipProps) => {
  const router = useRouter();

  return (
    <CssVarsProvider theme={theme}>
      <Chip
        onClick={() => router.push(`/backend/expenses/categories/${value.id}`)}
        sx={{ background: `${value.hex_color}` }}
      >
        {value.name}
      </Chip>
    </CssVarsProvider>
  );
};

export default CategoryChip;
