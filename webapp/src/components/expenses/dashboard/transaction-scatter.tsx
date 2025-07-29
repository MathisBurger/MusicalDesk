import LoadingComponent from "@/components/loading";
import useDashboardLastTransactionsQuery from "@/hooks/queries/expense/useDashboardLastTransactionsQuery";
import useMuiTheme from "@/hooks/useMuiTheme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ScatterChart } from "@mui/x-charts";
import { useTranslations } from "next-intl";

const DashboardLastTransactionChart = () => {
  const t = useTranslations();
  const muiTheme = useMuiTheme();
  const { data, isLoading } = useDashboardLastTransactionsQuery();

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ScatterChart
        height={100}
        series={[
          {
            label: t("labels.expense.dashboard.transactions"),
            data: (data ?? []).map((transaction) => ({
              id: transaction.id,
              y: transaction.amount / 100,
              x: new Date(transaction.timestamp).getTime(),
            })),
          },
        ]}
        xAxis={[
          {
            scaleType: "time",
            valueFormatter: (value) =>
              new Date(value).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
          },
        ]}
        yAxis={[
          {
            label: t("labels.expense.dashboard.amount"),
          },
        ]}
      />
    </ThemeProvider>
  );
};

export default DashboardLastTransactionChart;
