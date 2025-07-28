import LoadingComponent from "@/components/loading";
import useDashboardMoneyBalanceQuery from "@/hooks/queries/expense/useDashboardMoneyBalanceQuery";
import useDashboardTotalMoneyEarnedQuery from "@/hooks/queries/expense/useDashboardTotalMoneyEarnedQuery";
import useDashboardTotalMoneySpentQuery from "@/hooks/queries/expense/useDashboardTotalMoneySpentQuery";
import useDashboardTotalTransactionsCreatedQuery from "@/hooks/queries/expense/useDashboardTotalTransactionsCreatedQuery";
import { TimePeriod } from "@/types/api/expense";
import { Card, Grid, Stack, Typography } from "@mui/joy";

interface DashboardKpiCardsProps {
  period: TimePeriod;
}

const DashboardKpiCards = ({ period }: DashboardKpiCardsProps) => {
  const { data: spentData, isLoading: spentLoading } =
    useDashboardTotalMoneySpentQuery(period);
  const { data: earnedData, isLoading: earnedLoading } =
    useDashboardTotalMoneyEarnedQuery(period);
  const { data: moneyBalanceData, isLoading: moneyBalanceLoading } =
    useDashboardMoneyBalanceQuery();
  const { data: transactionsData, isLoading: transactionsLoading } =
    useDashboardTotalTransactionsCreatedQuery(period);

  return (
    <>
      <Grid xs={3}>
        <Card>
          <Stack spacing={2}>
            <Typography>Total money spent</Typography>
            {spentLoading ? (
              <LoadingComponent />
            ) : (
              <Typography level="h2">
                {((spentData?.total ?? 0) / 100).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                })}
              </Typography>
            )}
          </Stack>
        </Card>
      </Grid>
      <Grid xs={3}>
        <Card>
          <Stack spacing={2}>
            <Typography>Total money earned</Typography>
            {earnedLoading ? (
              <LoadingComponent />
            ) : (
              <Typography level="h2">
                {((earnedData?.total ?? 0) / 100).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                })}
              </Typography>
            )}
          </Stack>
        </Card>
      </Grid>
      <Grid xs={3}>
        <Card>
          <Stack spacing={2}>
            <Typography>Money balance</Typography>
            {moneyBalanceLoading ? (
              <LoadingComponent />
            ) : (
              <Typography level="h2">
                {((moneyBalanceData?.total ?? 0) / 100).toLocaleString(
                  "de-DE",
                  {
                    style: "currency",
                    currency: "EUR",
                  },
                )}
              </Typography>
            )}
          </Stack>
        </Card>
      </Grid>
      <Grid xs={3}>
        <Card>
          <Stack spacing={2}>
            <Typography>Transactions created</Typography>
            {transactionsLoading ? (
              <LoadingComponent />
            ) : (
              <Typography level="h2">{transactionsData?.total ?? 0}</Typography>
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );
};

export default DashboardKpiCards;
