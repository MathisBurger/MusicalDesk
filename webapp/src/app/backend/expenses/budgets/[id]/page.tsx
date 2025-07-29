"use client";
import BackButton from "@/components/back-button";
import CategoryChip from "@/components/expenses/category-chip";
import ExpensesList from "@/components/expenses/expenses-list";
import UpdateBudgetModal from "@/components/expenses/modal/update-budget";
import KvList, { DisplayedData } from "@/components/kv-list";
import LoadingComponent from "@/components/loading";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useBudgetExpensesQuery from "@/hooks/queries/expense/useBudgetExpensesQuery";
import useBudgetQuery from "@/hooks/queries/expense/useBudgetQuery";
import { MinimalCategory } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { Button, Card, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const BudgetDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const { data: budgetData, isLoading: budgetLoading } = useBudgetQuery(
    parseInt(id, 10),
  );
  const { data: expensesData, isLoading: expensesLoading } =
    useBudgetExpensesQuery(parseInt(id, 10), page, pageSize);

  const listData = useMemo<DisplayedData[]>(
    () => [
      {
        title: t("labels.expense.budget.name"),
        value: budgetData?.name,
      },
      {
        title: t("labels.expense.budget.category"),
        value: <CategoryChip value={budgetData?.category as MinimalCategory} />,
      },
      {
        title: t("labels.expense.budget.startDate"),
        value: budgetData?.start_date,
      },
      {
        title: t("labels.expense.budget.endDate"),
        value: budgetData?.end_date,
      },
      {
        title: t("labels.expense.budget.budget"),
        value: `${(budgetData?.budget ?? 0) / 100}€`,
      },
      {
        title: t("labels.expense.budget.spent"),
        value: `${(budgetData?.spent ?? 0) / 100}€`,
      },
    ],
    [budgetData, t],
  );

  if (budgetLoading) {
    return <LoadingComponent />;
  }

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <BackButton /> &nbsp;
        <Typography level="h2">{budgetData?.name}</Typography>
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
              <ExpensesList
                expenses={expensesData?.results ?? []}
                loading={expensesLoading}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                rowCount={expensesData?.total ?? 0}
              />
            </Card>
          </Grid>
        </Grid>
      </Stack>
      {editModalOpen && budgetData && (
        <UpdateBudgetModal
          budget={budgetData}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </RoleWrapper>
  );
};

export default BudgetDetailsPage;
