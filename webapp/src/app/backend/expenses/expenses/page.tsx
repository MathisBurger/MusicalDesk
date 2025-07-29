"use client";

import ExpensesList from "@/components/expenses/expenses-list";
import RequestExpenseModal from "@/components/expenses/modal/request-expense";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useExpensesQuery from "@/hooks/queries/expense/useExpensesQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Add } from "@mui/icons-material";
import { Button, Grid, Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ExpensesPage = () => {
  const currentUser = useCurrentUser();
  const t = useTranslations();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const { data, isLoading } = useExpensesQuery(page, pageSize);

  return (
    <RoleWrapper roles={[UserRole.Accountant, UserRole.ExpenseRequestor]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">{t("headings.expenses")}</Typography>
          </Grid>
          {isGranted(currentUser, [
            UserRole.ExpenseRequestor,
            UserRole.Admin,
          ]) && (
            <Grid>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Add />
                &nbsp; {t("generic.create")}
              </Button>
            </Grid>
          )}
        </Grid>
        <ExpensesList
          expenses={data?.results ?? []}
          loading={isLoading}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          rowCount={data?.total ?? 0}
        />
        {createModalOpen && (
          <RequestExpenseModal
            pageSize={pageSize}
            onClose={() => setCreateModalOpen(false)}
          />
        )}
      </Stack>
    </RoleWrapper>
  );
};

export default ExpensesPage;
