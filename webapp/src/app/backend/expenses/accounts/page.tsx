"use client";
import EntityList, { EntityListRowAction } from "@/components/entity-list";
import CreateAccountModal from "@/components/expenses/modal/create-account";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useAccountsQuery from "@/hooks/queries/expense/useAccountsQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import { AccountType } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Add } from "@mui/icons-material";
import { Button, Grid, Stack, Typography } from "@mui/joy";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AccountsPage = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [createAccountModalOpen, setCreateAccountModalOpen] =
    useState<boolean>(false);

  const { data, isLoading } = useAccountsQuery();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "owner_name",
      headerName: "Name des Besitzers",
    },
    {
      field: "iban",
      headerName: "IBAN",
      width: 200,
    },
    {
      field: "balance",
      headerName: "Balance",
      width: 200,
      renderCell: ({ row }) =>
        row.account_type === AccountType.FLOW
          ? "unknown"
          : `${(row.balance ?? 0) / 100}€`,
    },
    {
      field: "account_type",
      headerName: "Account Type",
      width: 150,
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: "Details",
      onClick: (row) => router.push(`/backend/expenses/accounts/${row.id}`),
      color: "primary",
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">Accounts</Typography>
          </Grid>
          {isGranted(currentUser, [UserRole.Accountant, UserRole.Admin]) && (
            <Grid>
              <Button onClick={() => setCreateAccountModalOpen(true)}>
                <Add />
                &nbsp; Create
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
      {createAccountModalOpen && (
        <CreateAccountModal onClose={() => setCreateAccountModalOpen(false)} />
      )}
    </RoleWrapper>
  );
};

export default AccountsPage;
