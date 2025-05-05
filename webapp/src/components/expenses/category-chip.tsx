import { MinimalCategory } from "@/hooks/queries/expense/useAccountTransactionsQuery";
import { Category } from "@/hooks/queries/expense/useCategoriesQuery";
import { Chip } from "@mui/material";
import { useRouter } from "next/navigation";

interface CategoryChipProps {
  value: Category | MinimalCategory;
}

const CategoryChip = ({ value }: CategoryChipProps) => {
  const router = useRouter();

  return (
    <Chip
      onClick={() => router.push(`/backend/expenses/categories/${value.id}`)}
      sx={{ background: `${value.hex_color}`, color: "white" }}
      label={value.name}
    />
  );
};

export default CategoryChip;
