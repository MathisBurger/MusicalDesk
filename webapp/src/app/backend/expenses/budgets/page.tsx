"use client";
import EntityList, { EntityListRowAction } from "@/components/entity-list";
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
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BudgetsPage = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [active, setActive] = useState<number>(1);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const { data, isLoading } = useBudgetsQuery(active === 1);

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
      field: "category",
      headerName: "Category",
      renderCell: ({ row }) => (
        <CategoryChip value={row.category as MinimalCategory} />
      ),
    },
    {
      field: "start_date",
      headerName: "Startdate",
    },
    {
      field: "end_date",
      headerName: "Enddate",
    },
    {
      field: "budget",
      headerName: "Budget",
      valueFormatter: (value) => `${value}€`,
    },
    {
      field: "spent",
      headerName: "Spent",
      valueFormatter: (value) => `${value}€`,
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: "Details",
      onClick: (row) => router.push(`/backend/expenses/budgets/${row.id}`),
      color: "primary",
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">Budgets</Typography>
          </Grid>
          {isGranted(currentUser, [UserRole.Accountant, UserRole.Admin]) && (
            <Grid>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Add />
                &nbsp; Create
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
            <Tab value={1}>Active</Tab>
            <Tab value={0}>Inactive</Tab>
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
