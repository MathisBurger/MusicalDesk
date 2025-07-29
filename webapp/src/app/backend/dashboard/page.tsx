"use client";

import EventDashboardTile from "@/components/events/dashboard-tile";
import DashboardKpiCards from "@/components/expenses/dashboard/kpi-cards";
import MemberDashboardTile from "@/components/members/dashboard-tile";
import useCurrentUser from "@/hooks/useCurrentUser";
import { TimePeriod } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Grid, Typography } from "@mui/joy";

const BackendDashboard = () => {
  const user = useCurrentUser();

  return (
    <Grid container spacing={2}>
      {isGranted(user, [UserRole.Accountant, UserRole.Admin]) && (
        <>
          <Grid xs={12}>
            <Typography level="h1">Expense</Typography>
          </Grid>
          <DashboardKpiCards period={TimePeriod.Year} />
        </>
      )}
      {isGranted(user, [UserRole.EventAdmin, UserRole.Admin]) && (
        <>
          <Grid xs={12}>
            <Typography level="h1">Events</Typography>
          </Grid>
          <EventDashboardTile />
        </>
      )}
      {isGranted(user, [UserRole.MemberAdmin, UserRole.Admin]) && (
        <>
          <Grid xs={12}>
            <Typography level="h1">Members</Typography>
          </Grid>
          <MemberDashboardTile />
        </>
      )}
    </Grid>
  );
};

export default BackendDashboard;
