import useMuiTheme from "@/hooks/useMuiTheme";
import { Stack, TabPanel } from "@mui/joy";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BarChart, PieChart, RadarChart } from "@mui/x-charts";
import LoadingComponent from "../loading";
import useReportSumupsQuery from "@/hooks/queries/expense/useReportSumupsQuery";
import TabLayout from "../wrapper/tab-layout";
import { useTranslations } from "next-intl";

interface ReportChartsProps {
  reportId: number;
}

const ReportCharts = ({ reportId }: ReportChartsProps) => {
  const muiTheme = useMuiTheme();
  const t = useTranslations();

  const { data: sumUpData, isLoading: sumUpDataLoading } =
    useReportSumupsQuery(reportId);

  if (sumUpDataLoading) {
    return <LoadingComponent />;
  }

  return (
    <Stack>
      <TabLayout
        tabs={[
          t("labels.expense.report.pieChart"),
          t("labels.expense.report.barChart"),
          t("labels.expense.report.radarChart"),
        ]}
      >
        <TabPanel value={0}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <PieChart
              series={[
                {
                  data: (sumUpData ?? []).map((sumUp) => ({
                    id: sumUp.category?.id ?? 0,
                    value: sumUp.sum,
                    label: sumUp.category?.name ?? t("generic.noCategory"),
                  })),
                  valueFormatter: (v) =>
                    v.value.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }),
                },
              ]}
            />
          </ThemeProvider>
        </TabPanel>
        <TabPanel value={1}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <BarChart
              series={[
                {
                  data: (sumUpData ?? []).map((sumUp) => sumUp.sum),
                  valueFormatter: (v) =>
                    v?.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }) ?? "0",
                },
              ]}
              xAxis={[
                {
                  data: (sumUpData ?? []).map(
                    (sumUp) => sumUp.category?.name ?? t("generic.noCategory"),
                  ),
                },
              ]}
            />
          </ThemeProvider>
        </TabPanel>
        <TabPanel value={2}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <RadarChart
              series={[
                {
                  data: (sumUpData ?? []).map((sumUp) => sumUp.sum),
                },
              ]}
              radar={{
                metrics: (sumUpData ?? []).map(
                  (sumUp) => sumUp.category?.name ?? t("generic.noCategory"),
                ),
              }}
            />
          </ThemeProvider>
        </TabPanel>
      </TabLayout>
    </Stack>
  );
};

export default ReportCharts;
