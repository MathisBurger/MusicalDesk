"use client";
import EntityList, {
  EntityListCol,
  EntityListRowAction,
} from "@/components/entity-list";
import CreateAccountModal from "@/components/expenses/modal/create-account";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useAccountsQuery from "@/hooks/queries/expense/useAccountsQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import { AccountType } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Add } from "@mui/icons-material";
import { Button, Grid, Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AccountsPage = () => {
  const currentUser = useCurrentUser();
  const t = useTranslations();
  const router = useRouter();
  const [createAccountModalOpen, setCreateAccountModalOpen] =
    useState<boolean>(false);

  const { data, isLoading } = useAccountsQuery();

  const cols: EntityListCol[] = [
    {
      field: "id",
      headerName: t("generic.id"),
      tooltip: t("tooltips.id"),
    },
    {
      field: "name",
      headerName: t("labels.expense.account.name"),
      width: 200,
      tooltip: t("tooltips.expense.account.name"),
    },
    {
      field: "owner_name",
      headerName: t("labels.expense.account.ownerName"),
      tooltip: t("tooltips.expense.account.ownerName"),
    },
    {
      field: "iban",
      headerName: t("labels.expense.account.iban"),
      width: 200,
      tooltip: t("tooltips.expense.account.iban"),
    },
    {
      field: "balance",
      headerName: t("labels.expense.account.balance"),
      width: 200,
      renderCell: ({ row }) =>
        row.account_type === AccountType.FLOW
          ? t("generic.unknown")
          : `${(row.balance ?? 0) / 100}€`,
      tooltip: t("tooltips.expense.account.balance"),
    },
    {
      field: "account_type",
      headerName: t("labels.expense.account.type"),
      width: 150,
      valueFormatter: (value) =>
        t(`labels.expense.account.types.${value as string}`),
      tooltip: t("tooltips.expense.account.type"),
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: t("generic.details"),
      onClick: (row) => router.push(`/backend/expenses/accounts/${row.id}`),
      color: "primary",
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">{t("headings.accounts")}</Typography>
          </Grid>
          {isGranted(currentUser, [UserRole.Accountant, UserRole.Admin]) && (
            <Grid>
              <Button onClick={() => setCreateAccountModalOpen(true)}>
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
      {createAccountModalOpen && (
        <CreateAccountModal onClose={() => setCreateAccountModalOpen(false)} />
      )}
    </RoleWrapper>
  );
};

export default AccountsPage;
