import LoadingComponent from "@/components/loading";
import useDashboardMoneySpentOverTimeByCategoryQuery from "@/hooks/queries/expense/useDashboardMoneySpentOverTimeByCategoryQuery";
import useMuiTheme from "@/hooks/useMuiTheme";
import { months, TimePeriod, week } from "@/types/api/expense";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BarChart, BarSeries } from "@mui/x-charts";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface DashboardMoneySpentOverTimeByCategoryChartProps {
  period: TimePeriod;
}

const DashboardMoneySpentOverTimeByCategoryChart = ({
  period,
}: DashboardMoneySpentOverTimeByCategoryChartProps) => {
  const muiTheme = useMuiTheme();
  const t = useTranslations();
  const { data, isLoading } =
    useDashboardMoneySpentOverTimeByCategoryQuery(period);

  const chartData = useMemo(() => {
    const categoriesSet = new Set<string>();
    const timesSet = new Set<number>();

    const grouped = new Map<number, Record<string, number>>();
    for (const { time, value, category } of data ?? []) {
      const normalizedCategory = category?.name ?? t("generic.noCategory");
      categoriesSet.add(normalizedCategory);
      timesSet.add(time);

      if (!grouped.has(time)) {
        grouped.set(time, {});
      }
      grouped.get(time)![normalizedCategory] = value / 100;
    }

    const categories = Array.from(categoriesSet);
    const times = Array.from(timesSet).sort();

    const series = categories.map((category) => ({
      label: category,
      stack: "total",
      data: times.map((time) => grouped.get(time)?.[category] ?? 0),
    }));

    return { times, series };
  }, [data, t]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BarChart
        height={200}
        xAxis={[{ data: chartData.times, scaleType: "band" }]}
        series={chartData.series}
      />
    </ThemeProvider>
  );
};

export default DashboardMoneySpentOverTimeByCategoryChart;
