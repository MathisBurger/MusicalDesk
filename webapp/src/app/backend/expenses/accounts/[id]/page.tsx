"use client";
import BackButton from "@/components/back-button";
import UpdateAccountModal from "@/components/expenses/modal/update-account";
import TransactionsList from "@/components/expenses/transactions-list";
import KvList, { DisplayedData } from "@/components/kv-list";
import LoadingComponent from "@/components/loading";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useAccountQuery from "@/hooks/queries/expense/useAccountQuery";
import useAccountTransactionsQuery from "@/hooks/queries/expense/useAccountTransactionsQuery";
import { AccountType } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { Button, Card, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const AccountDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const { data: accountData, isLoading: accountDataLoading } = useAccountQuery(
    parseInt(id, 10),
  );
  const { data: transactionsData, isLoading: transactionsLoading } =
    useAccountTransactionsQuery(parseInt(id, 10), page, pageSize);

  const listData = useMemo<DisplayedData[]>(() => {
    const fields = [
      {
        title: t("labels.expense.account.name"),
        value: accountData?.name,
      },
      {
        title: t("labels.expense.account.ownerName"),
        value: accountData?.owner_name,
      },
      {
        title: t("labels.expense.account.balance"),
        value:
          accountData?.account_type === AccountType.FLOW
            ? t("generic.unknown")
            : `${(accountData?.balance ?? 0) / 100}€`,
      },
      {
        title: t("labels.expense.account.type"),
        value: t("labels.expense.account.types." + accountData?.account_type),
      },
    ];
    if (
      accountData?.account_type === AccountType.MONEY ||
      accountData?.account_type === AccountType.FOREIGN
    ) {
      fields.push({
        title: t("labels.expense.account.iban"),
        value: accountData?.iban,
      });
    }
    return fields;
  }, [accountData, t]);

  if (accountDataLoading) {
    return <LoadingComponent />;
  }

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <BackButton /> &nbsp;
        <Typography level="h2">{accountData?.name}</Typography>
        <Divider />
        <Card>
          <Stack direction="row" spacing={2}>
            <Button color="primary" onClick={() => setEditModalOpen(true)}>
              {t("generic.edit")}
            </Button>
          </Stack>
        </Card>
        <Grid container spacing={2}>
          <Grid xs={4}>
            <Card>
              <KvList displayData={listData} />
            </Card>
          </Grid>
          <Grid xs={8}>
            <Card>
              <TransactionsList
                transactions={transactionsData?.results ?? []}
                loading={transactionsLoading}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                rowCount={transactionsData?.total ?? 0}
              />
            </Card>
          </Grid>
        </Grid>
      </Stack>
      {editModalOpen && accountData && (
        <UpdateAccountModal
          account={accountData}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </RoleWrapper>
  );
};

export default AccountDetailsPage;
