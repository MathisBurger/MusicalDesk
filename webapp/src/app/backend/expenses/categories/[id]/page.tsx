"use client";
import BackButton from "@/components/back-button";
import CategoryChip from "@/components/expenses/category-chip";
import UpdateCategoryModal from "@/components/expenses/modal/update-category";
import TransactionsList from "@/components/expenses/transactions-list";
import KvList, { DisplayedData } from "@/components/kv-list";
import LoadingComponent from "@/components/loading";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useCategoryQuery from "@/hooks/queries/expense/useCategoryQuery";
import useCategoryTransactionsQuery from "@/hooks/queries/expense/useCategoryTransactionsQuery";
import { UserRole } from "@/types/api/user";
import { Check, Clear } from "@mui/icons-material";
import { Button, Card, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const { data: categoryData, isLoading: categoryDataLoading } =
    useCategoryQuery(parseInt(id, 10));
  const { data: transactionsData, isLoading: transactionsLoading } =
    useCategoryTransactionsQuery(parseInt(id, 10), page, pageSize);

  const listData = useMemo<DisplayedData[]>(
    () => [
      {
        title: t("labels.expense.category.name"),
        value: categoryData?.name,
      },
      {
        title: t("labels.expense.category.color"),
        value: categoryData ? <CategoryChip value={categoryData} /> : null,
      },
      {
        title: t("labels.expense.category.isIncome"),
        value: categoryData?.is_income ? <Check /> : <Clear />,
      },
    ],
    [categoryData, t],
  );

  if (categoryDataLoading) {
    return <LoadingComponent />;
  }

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <BackButton /> &nbsp;
        <Typography level="h2">{categoryData?.name}</Typography>
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
      {editModalOpen && categoryData && (
        <UpdateCategoryModal
          category={categoryData}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </RoleWrapper>
  );
};

export default CategoryPage;
