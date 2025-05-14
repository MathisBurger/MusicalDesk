"use client";
import CreateTransactionModal from "@/components/expenses/modal/create-transaction";
import TransactionsList from "@/components/expenses/transactions-list";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useTransactionsQuery from "@/hooks/queries/expense/useTransactionsQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Add } from "@mui/icons-material";
import { Button, Grid, Stack, Typography } from "@mui/joy";
import { useState } from "react";

const TransactionsPage = () => {
  const currentUser = useCurrentUser();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const { data, isLoading } = useTransactionsQuery(page, pageSize);

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">Transactions</Typography>
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
        <TransactionsList
          transactions={data?.results ?? []}
          rowCount={data?.total ?? 0}
          loading={isLoading}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
        {createModalOpen && (
          <CreateTransactionModal
            pageSize={pageSize}
            onClose={() => setCreateModalOpen(false)}
          />
        )}
      </Stack>
    </RoleWrapper>
  );
};

export default TransactionsPage;
