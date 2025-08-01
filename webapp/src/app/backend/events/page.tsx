"use client";
import EventList from "@/components/events/event-list";
import InvalidateView from "@/components/events/invalidate-view";
import CreateEventModal from "@/components/events/modal/create-event";
import TicketByQrCodeView from "@/components/events/ticket-by-qr-view";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import TabLayout from "@/components/wrapper/tab-layout";
import useCurrentUser from "@/hooks/useCurrentUser";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Add } from "@mui/icons-material";
import { Button, Divider, Grid, Stack, TabPanel, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const EventsPage = () => {
  const t = useTranslations();
  const [createEventModalOpen, setCreateEventModalOpen] =
    useState<boolean>(false);
  const currentUser = useCurrentUser();

  const tabs = useMemo<string[]>(() => {
    const tabKeys = [];
    if (isGranted(currentUser, [UserRole.EventAdmin, UserRole.Admin])) {
      tabKeys.push(t("tabs.events.events"));
    }
    if (isGranted(currentUser, [UserRole.TicketInvalidator, UserRole.Admin])) {
      tabKeys.push(t("tabs.events.invalidateTickets"));
      tabKeys.push(t("tabs.events.checkTickets"));
    }
    return tabKeys;
  }, [currentUser, t]);

  return (
    <RoleWrapper roles={[UserRole.EventAdmin, UserRole.TicketInvalidator]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">{t("labels.events.events")}</Typography>
          </Grid>
          {isGranted(currentUser, [UserRole.EventAdmin, UserRole.Admin]) && (
            <Grid>
              <Button onClick={() => setCreateEventModalOpen(true)}>
                <Add />
                &nbsp; {t("generic.create")}
              </Button>
            </Grid>
          )}
        </Grid>
        <Divider />
        <TabLayout tabs={tabs}>
          {isGranted(currentUser, [UserRole.EventAdmin, UserRole.Admin]) && (
            <TabPanel value={tabs.length - 3}>
              <EventList />
            </TabPanel>
          )}
          {isGranted(currentUser, [
            UserRole.TicketInvalidator,
            UserRole.Admin,
          ]) && (
            <>
              <TabPanel value={tabs.length - 2}>
                <InvalidateView />
              </TabPanel>
              <TabPanel value={tabs.length - 1}>
                <TicketByQrCodeView />
              </TabPanel>
            </>
          )}
        </TabLayout>
        {createEventModalOpen && (
          <CreateEventModal onClose={() => setCreateEventModalOpen(false)} />
        )}
      </Stack>
    </RoleWrapper>
  );
};

export default EventsPage;
