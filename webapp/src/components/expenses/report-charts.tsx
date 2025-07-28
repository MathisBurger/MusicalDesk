import useMuiTheme from "@/hooks/useMuiTheme";
import { Stack, TabPanel } from "@mui/joy";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BarChart, PieChart, RadarChart } from "@mui/x-charts";
import LoadingComponent from "../loading";
import useReportSumupsQuery from "@/hooks/queries/expense/useReportSumupsQuery";
import TabLayout from "../wrapper/tab-layout";

interface ReportChartsProps {
  reportId: number;
}

const ReportCharts = ({ reportId }: ReportChartsProps) => {
  const muiTheme = useMuiTheme();

  const { data: sumUpData, isLoading: sumUpDataLoading } =
    useReportSumupsQuery(reportId);

  if (sumUpDataLoading) {
    return <LoadingComponent />;
  }

  return (
    <Stack>
      <TabLayout tabs={["Pie chart", "Bar chart", "Radar chart"]}>
        <TabPanel value={0}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <PieChart
              series={[
                {
                  data: (sumUpData ?? []).map((sumUp) => ({
                    id: sumUp.category?.id ?? 0,
                    value: sumUp.sum,
                    label: sumUp.category?.name ?? "(no category)",
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
                    v.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }),
                },
              ]}
              xAxis={[
                {
                  data: (sumUpData ?? []).map(
                    (sumUp) => sumUp.category?.name ?? "(no category)",
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
                  (sumUp) => sumUp.category?.name ?? "(no category)",
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
