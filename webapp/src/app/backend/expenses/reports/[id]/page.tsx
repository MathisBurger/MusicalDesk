"use client";
import BackButton from "@/components/back-button";
import ReportCharts from "@/components/expenses/report-charts";
import TransactionsList from "@/components/expenses/transactions-list";
import KvList, { DisplayedData } from "@/components/kv-list";
import LoadingComponent from "@/components/loading";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useReportQuery from "@/hooks/queries/expense/useReportQuery";
import useReportTransactionsQuery from "@/hooks/queries/expense/useReportTransactionsQuery";
import { UserRole } from "@/types/api/user";
import { Card, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const ReportDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const { data: reportData, isLoading: reportDataLoading } = useReportQuery(
    parseInt(id, 10),
  );
  const { data: transactionsData, isLoading: transactionsLoading } =
    useReportTransactionsQuery(parseInt(id, 10), page, pageSize);

  const listData = useMemo<DisplayedData[]>(
    () => [
      {
        title: t("labels.expense.report.name"),
        value: reportData?.name,
      },
      {
        title: t("labels.expense.report.startDate"),
        value: reportData?.start_date,
      },
      {
        title: t("labels.expense.report.endDate"),
        value: reportData?.end_date,
      },
    ],
    [reportData, t],
  );

  if (reportDataLoading) {
    return <LoadingComponent />;
  }

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <BackButton /> &nbsp;
        <Typography level="h2">{reportData?.name}</Typography>
        <Divider />
        <Grid container spacing={2}>
          <Grid xs={4}>
            <Card>
              <KvList displayData={listData} />
            </Card>
          </Grid>
          <Grid xs={8}>
            <Card>
              <ReportCharts reportId={parseInt(id, 10)} />
            </Card>
          </Grid>
          <Grid xs={12}>
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
    </RoleWrapper>
  );
};

export default ReportDetailsPage;
