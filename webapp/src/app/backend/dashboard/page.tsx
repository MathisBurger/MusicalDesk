"use client";

import EventDashboardTile from "@/components/events/dashboard-tile";
import DashboardKpiCards from "@/components/expenses/dashboard/kpi-cards";
import MemberDashboardTile from "@/components/members/dashboard-tile";
import useCurrentUser from "@/hooks/useCurrentUser";
import { TimePeriod } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Grid, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";

const BackendDashboard = () => {
  const user = useCurrentUser();
  const t = useTranslations("dashboard");

  return (
    <Grid container spacing={2}>
      {isGranted(user, [UserRole.Accountant, UserRole.Admin]) && (
        <>
          <Grid xs={12}>
            <Typography level="h1">{t("expense")}</Typography>
          </Grid>
          <DashboardKpiCards period={TimePeriod.Year} />
        </>
      )}
      {isGranted(user, [UserRole.EventAdmin, UserRole.Admin]) && (
        <>
          <Grid xs={12}>
            <Typography level="h1">{t("events")}</Typography>
          </Grid>
          <EventDashboardTile />
        </>
      )}
      {isGranted(user, [UserRole.MemberAdmin, UserRole.Admin]) && (
        <>
          <Grid xs={12}>
            <Typography level="h1">{t("members")}</Typography>
          </Grid>
          <MemberDashboardTile />
        </>
      )}
    </Grid>
  );
};

export default BackendDashboard;
