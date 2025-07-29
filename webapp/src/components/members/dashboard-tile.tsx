import useDashboardExpectedMembershipFeesQuery from "@/hooks/queries/membership/useDashboardExpectedMembershipFeesQuery";
import useDashboardMemberCountQuery from "@/hooks/queries/membership/useDashboardMemberCountQuery";
import { Card, Grid, Stack, Typography } from "@mui/joy";

const MemberDashboardTile = () => {
  const { data: memberCount } = useDashboardMemberCountQuery();
  const { data: expectedFees } = useDashboardExpectedMembershipFeesQuery();

  return (
    <>
      <Grid xs={3}>
        <Card>
          <Stack spacing={2}>
            <Typography>Total members</Typography>
            <Typography level="h2">{memberCount?.total}</Typography>
          </Stack>
        </Card>
      </Grid>
      <Grid xs={3}>
        <Card>
          <Stack spacing={2}>
            <Typography>Expected fees this year</Typography>
            <Typography level="h2">
              {expectedFees?.total.toLocaleString("de-DE", {
                style: "currency",
                currency: "EUR",
              })}
            </Typography>
          </Stack>
        </Card>
      </Grid>
    </>
  );
};

export default MemberDashboardTile;
