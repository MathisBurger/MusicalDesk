"use client";

import BackButton from "@/components/back-button";
import CoreDataTab from "@/components/events/core-data-tab";
import EventTicketList from "@/components/events/event-ticket-list";
import CreateTicketsModal from "@/components/events/modal/create-tickets";
import EditEventModal from "@/components/events/modal/edit-event";
import LoadingComponent from "@/components/loading";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import TabLayout from "@/components/wrapper/tab-layout";
import useEventQuery from "@/hooks/queries/event/useEventQuery";
import { UserRole } from "@/hooks/useCurrentUser";
import { Button, Card, Divider, Stack, TabPanel, Typography } from "@mui/joy";
import { useParams } from "next/navigation";
import { useState } from "react";

const MemberDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [createTicketsModalOpen, setCreateTicketsModalOpen] =
    useState<boolean>(false);

  const { data, isLoading } = useEventQuery(parseInt(id, 10));

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <RoleWrapper roles={[UserRole.EventAdmin]}>
      <Stack spacing={2}>
        <BackButton /> &nbsp;
        <Typography level="h2">{data?.name}</Typography>
        <Divider />
        <Card>
          <Stack direction="row" spacing={2}>
            <Button color="primary" onClick={() => setEditModalOpen(true)}>
              Edit
            </Button>
            <Button
              color="primary"
              onClick={() => setCreateTicketsModalOpen(true)}
            >
              Create tickets
            </Button>
          </Stack>
        </Card>
        <TabLayout tabs={["Core data", "Tickets"]}>
          <TabPanel value={0}>{data && <CoreDataTab event={data} />}</TabPanel>
          <TabPanel value={1}>
            {data && <EventTicketList eventId={data.id} />}
          </TabPanel>
        </TabLayout>
        {editModalOpen && data && (
          <EditEventModal
            onClose={() => setEditModalOpen(false)}
            event={data}
          />
        )}
        {createTicketsModalOpen && data && (
          <CreateTicketsModal
            onClose={() => setCreateTicketsModalOpen(false)}
            eventId={data.id}
          />
        )}
      </Stack>
    </RoleWrapper>
  );
};

export default MemberDetailsPage;
