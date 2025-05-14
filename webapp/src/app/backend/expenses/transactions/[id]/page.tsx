"use client";
import BackButton from "@/components/back-button";
import AccountChip from "@/components/expenses/account-chip";
import CategoryChip from "@/components/expenses/category-chip";
import KvList, { DisplayedData } from "@/components/kv-list";
import LoadingComponent from "@/components/loading";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useTransactionQuery from "@/hooks/queries/expense/useTransactionQuery";
import { UserRole } from "@/types/api/user";
import { Check, Clear } from "@mui/icons-material";
import { Card, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const TransactionPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useTransactionQuery(parseInt(id, 10));

  const listData = useMemo<DisplayedData[]>(
    () => [
      {
        title: "ID",
        value: data?.id,
      },
      {
        title: "Name",
        value: data?.name,
      },
      {
        title: "Amount",
        value: `${(data?.amount ?? 0) / 100}€`,
      },
      {
        title: "From account",
        value: data?.from_account ? (
          <AccountChip account={data?.from_account} />
        ) : null,
      },
      {
        title: "To account",
        value: data?.to_account ? (
          <AccountChip account={data?.to_account} />
        ) : null,
      },
      {
        title: "Category",
        value: data?.category ? <CategoryChip value={data.category} /> : null,
      },
      {
        title: "Timestamp",
        value: `${data?.timestamp}`,
      },
      {
        title: "Is money transaction",
        value: data?.is_money_transaction ? <Check /> : <Clear />,
      },
    ],
    [data],
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <BackButton /> &nbsp;
        <Typography level="h2">
          {data?.name} ({data?.id})
        </Typography>
        <Divider />
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Card>
              <KvList displayData={listData} />
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </RoleWrapper>
  );
};

export default TransactionPage;
