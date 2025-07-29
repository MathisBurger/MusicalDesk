import LoadingComponent from "@/components/loading";
import useDashboardBudgetsQuery from "@/hooks/queries/expense/useDashboardBudgetsQuery";
import useMuiTheme from "@/hooks/useMuiTheme";
import { BarChart } from "@mui/x-charts";
import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useTranslations } from "next-intl";

const DashboardBudgetsChart = () => {
  const muiTheme = useMuiTheme();
  const t = useTranslations();
  const { data, isLoading } = useDashboardBudgetsQuery();

  const chartData = useMemo(() => {
    return (data ?? []).map((b) => {
      const green = Math.min(b.spent, b.budget);
      const purple = b.spent < b.budget ? b.budget - b.spent : 0;
      const red = b.spent > b.budget ? b.spent - b.budget : 0;

      return {
        name: b.name,
        green: green / 100,
        purple: purple / 100,
        red: red / 100,
      };
    });
  }, [data]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BarChart
        height={100}
        dataset={chartData}
        xAxis={[{ scaleType: "band", dataKey: "name" }]}
        series={[
          {
            dataKey: "green",
            stack: "total",
            color: "green",
            label: t("labels.expense.dashboard.spent"),
          },
          {
            dataKey: "purple",
            stack: "total",
            color: "purple",
            label: t("labels.expense.dashboard.remaining"),
          },
          {
            dataKey: "red",
            stack: "total",
            color: "red",
            label: t("labels.expense.dashboard.over"),
          },
        ]}
      />
    </ThemeProvider>
  );
};

export default DashboardBudgetsChart;
