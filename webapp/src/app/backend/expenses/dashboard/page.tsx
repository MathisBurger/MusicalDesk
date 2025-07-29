"use client";
import DashboardBudgetsChart from "@/components/expenses/dashboard/budgets-chart";
import DashboardKpiCards from "@/components/expenses/dashboard/kpi-cards";
import DashboardMoneySpentOverTimeChart from "@/components/expenses/dashboard/spent-over-time";
import DashboardMoneySpentOverTimeByCategoryChart from "@/components/expenses/dashboard/spent-over-time-by-category";
import DashboardLastTransactionChart from "@/components/expenses/dashboard/transaction-scatter";
import { TimePeriod } from "@/types/api/expense";
import {
  Button,
  Card,
  Grid,
  Stack,
  ToggleButtonGroup,
  Typography,
} from "@mui/joy";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ExpenseDashboardPage = () => {
  const [timePeriod, setTimePeriod] = useState(TimePeriod.Month);
  const t = useTranslations();

  return (
    <Grid container spacing={2}>
      <Grid xs={6}>
        <Card>
          <Stack spacing={2}>
            <Typography>
              {t("labels.expense.dashboard.budgetStatus")}
            </Typography>
            <DashboardBudgetsChart />
          </Stack>
        </Card>
      </Grid>
      <Grid xs={6}>
        <Card>
          <Stack spacing={2}>
            <Typography>
              {t("labels.expense.dashboard.lastTransactions")}
            </Typography>
            <DashboardLastTransactionChart />
          </Stack>
        </Card>
      </Grid>
      <Grid xs={12}>
        <ToggleButtonGroup
          value={timePeriod}
          onChange={(_, newVal) => setTimePeriod(newVal ?? TimePeriod.Month)}
        >
          <Button value={TimePeriod.Week}>7d</Button>
          <Button value={TimePeriod.Month}>30d</Button>
          <Button value={TimePeriod.Year}>1J</Button>
          <Button value={TimePeriod.FiveYears}>5J</Button>
        </ToggleButtonGroup>
      </Grid>
      <DashboardKpiCards period={timePeriod} />
      <Grid xs={6}>
        <Card>
          <Stack spacing={2}>
            <Typography>
              {t("labels.expense.dashboard.spentOverTime")}
            </Typography>
            <DashboardMoneySpentOverTimeChart period={timePeriod} />
          </Stack>
        </Card>
      </Grid>
      <Grid xs={6}>
        <Card>
          <Stack spacing={2}>
            <Typography>
              {t("labels.expense.dashboard.spentOverTimeByCategory")}
            </Typography>
            <DashboardMoneySpentOverTimeByCategoryChart period={timePeriod} />
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ExpenseDashboardPage;
