"use client";
import EntityList, {
  EntityListCol,
  EntityListRowAction,
} from "@/components/entity-list";
import CategoryChip from "@/components/expenses/category-chip";
import CreateBudgetModal from "@/components/expenses/modal/create-budget";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useBudgetsQuery from "@/hooks/queries/expense/useBudgetsQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import { MinimalCategory } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Add } from "@mui/icons-material";
import { Button, Grid, Stack, Tab, TabList, Tabs, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BudgetsPage = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const t = useTranslations();
  const [active, setActive] = useState<number>(1);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const { data, isLoading } = useBudgetsQuery(active === 1);

  const cols: EntityListCol[] = [
    {
      field: "id",
      headerName: t("generic.id"),
      tooltip: t("tooltips.id"),
    },
    {
      field: "name",
      headerName: t("labels.expense.budget.name"),
      tooltip: t("tooltips.expense.budget.name"),
    },
    {
      field: "category",
      headerName: t("labels.expense.budget.category"),
      renderCell: ({ row }) => (
        <CategoryChip value={row.category as MinimalCategory} />
      ),
      tooltip: t("tooltips.expense.budget.category"),
    },
    {
      field: "start_date",
      headerName: t("labels.expense.budget.startDate"),
      tooltip: t("tooltips.expense.budget.startDate"),
    },
    {
      field: "end_date",
      headerName: t("labels.expense.budget.endDate"),
      tooltip: t("tooltips.expense.budget.endDate"),
    },
    {
      field: "budget",
      headerName: t("labels.expense.budget.budget"),
      valueFormatter: (value) => `${(value ?? 0) / 100}€`,
      tooltip: t("tooltips.expense.budget.budget"),
    },
    {
      field: "spent",
      headerName: t("labels.expense.budget.spent"),
      valueFormatter: (value) => `${(value ?? 0) / 100}€`,
      tooltip: t("tooltips.expense.budget.spent"),
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: t("generic.details"),
      onClick: (row) => router.push(`/backend/expenses/budgets/${row.id}`),
      color: "primary",
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">{t("headings.budgets")}</Typography>
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
        <Tabs
          value={active}
          sx={{ bgcolor: "transparent" }}
          onChange={(_, newValue) => setActive(newValue as number)}
        >
          <TabList>
            <Tab value={1}>{t("generic.active")}</Tab>
            <Tab value={0}>{t("generic.inactive")}</Tab>
          </TabList>
        </Tabs>
        <EntityList
          columns={cols}
          rows={data ?? []}
          loading={isLoading}
          rowActions={rowActions}
        />
      </Stack>
      {createModalOpen && (
        <CreateBudgetModal onClose={() => setCreateModalOpen(false)} />
      )}
    </RoleWrapper>
  );
};

export default BudgetsPage;
