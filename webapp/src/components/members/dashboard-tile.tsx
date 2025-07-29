import useDashboardExpectedMembershipFeesQuery from "@/hooks/queries/membership/useDashboardExpectedMembershipFeesQuery";
import useDashboardMemberCountQuery from "@/hooks/queries/membership/useDashboardMemberCountQuery";
import { Card, Grid, Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";

const MemberDashboardTile = () => {
  const { data: memberCount } = useDashboardMemberCountQuery();
  const { data: expectedFees } = useDashboardExpectedMembershipFeesQuery();
  const t = useTranslations();

  return (
    <>
      <Grid xs={3}>
        <Card>
          <Stack spacing={2}>
            <Typography>{t("labels.member.dashboard.totalMembers")}</Typography>
            <Typography level="h2">{memberCount?.total}</Typography>
          </Stack>
        </Card>
      </Grid>
      <Grid xs={3}>
        <Card>
          <Stack spacing={2}>
            <Typography>{t("labels.member.dashboard.expectedFees")}</Typography>
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
