import LoadingComponent from "@/components/loading";
import useDashboardMoneySpentOverTimeQuery from "@/hooks/queries/expense/useDashboardMoneySpentOverTimeQuery";
import useMuiTheme from "@/hooks/useMuiTheme";
import { TimePeriod } from "@/types/api/expense";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LineChart } from "@mui/x-charts";

interface DashboardMoneySpentOverTimeChartProps {
  period: TimePeriod;
}

const DashboardMoneySpentOverTimeChart = ({
  period,
}: DashboardMoneySpentOverTimeChartProps) => {
  const muiTheme = useMuiTheme();
  const { data, isLoading } = useDashboardMoneySpentOverTimeQuery(period);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <LineChart
        height={200}
        series={[
          {
            data: (data ?? []).map((d) => d.value / 100),
          },
        ]}
        xAxis={[
          {
            data: (data ?? []).map((d) => d.label),
          },
        ]}
      />
    </ThemeProvider>
  );
};

export default DashboardMoneySpentOverTimeChart;
