"use client";
import EntityList, {
  EntityListCol,
  EntityListRowAction,
} from "@/components/entity-list";
import CategoryChip from "@/components/expenses/category-chip";
import CreateCategoryModal from "@/components/expenses/modal/create-category";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useCategoriesQuery from "@/hooks/queries/expense/useCategoriesQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Category } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Add } from "@mui/icons-material";
import { Button, Grid, Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CategoriesPage = () => {
  const currentUser = useCurrentUser();
  const t = useTranslations();
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const { data, isLoading } = useCategoriesQuery();

  const cols: EntityListCol[] = [
    {
      field: "id",
      headerName: t("generic.id"),
      tooltip: t("tooltips.id"),
    },
    {
      field: "name",
      headerName: t("labels.expense.category.name"),
      width: 200,
      tooltip: t("tooltips.expense.category.name"),
    },
    {
      field: "hex_color",
      headerName: t("labels.expense.category.color"),
      renderCell: ({ row }) => <CategoryChip value={row as Category} />,
      tooltip: t("tooltips.expense.category.color"),
    },
    {
      field: "is_income",
      headerName: t("labels.expense.category.isIncome"),
      width: 150,
      type: "boolean",
      tooltip: t("tooltips.expense.category.isIncome"),
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: t("generic.details"),
      onClick: (row) => router.push(`/backend/expenses/categories/${row.id}`),
      color: "primary",
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">{t("headings.categories")}</Typography>
          </Grid>
          {isGranted(currentUser, [UserRole.Accountant, UserRole.Admin]) && (
            <Grid>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Add />
                &nbsp; {t("generic.create")}
              </Button>
            </Grid>
          )}
        </Grid>
        <EntityList
          columns={cols}
          rows={data ?? []}
          loading={isLoading}
          rowActions={rowActions}
        />
      </Stack>
      {createModalOpen && (
        <CreateCategoryModal onClose={() => setCreateModalOpen(false)} />
      )}
    </RoleWrapper>
  );
};

export default CategoriesPage;
