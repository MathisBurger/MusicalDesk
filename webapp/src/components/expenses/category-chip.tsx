"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Category, MinimalCategory } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
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
  const currentUser = useCurrentUser();

  return (
    <CssVarsProvider theme={theme}>
      <Chip
        onClick={
          isGranted(currentUser, [UserRole.Accountant, UserRole.Admin])
            ? () => router.push(`/backend/expenses/categories/${value.id}`)
            : undefined
        }
        sx={{ background: `${value.hex_color}` }}
      >
        {value.name}
      </Chip>
    </CssVarsProvider>
  );
};

export default CategoryChip;
