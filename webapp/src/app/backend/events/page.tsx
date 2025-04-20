"use client";
import EntityList, { EntityListRowAction } from "@/components/entity-list";
import CreateEventModal from "@/components/events/modal/create-event";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useEventsQuery from "@/hooks/queries/event/useEventsQuery";
import { UserRole } from "@/hooks/useCurrentUser";
import { Add } from "@mui/icons-material";
import { Button, Divider, Grid, Stack, Typography } from "@mui/joy";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EventsPage = () => {
  const [createEventModalOpen, setCreateEventModalOpen] =
    useState<boolean>(false);

  const router = useRouter();

  const { data, isLoading } = useEventsQuery();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      valueFormatter: (v) => `${v}€`,
    },
    {
      field: "tax_percentage",
      headerName: "Tax",
      valueFormatter: (v) => `${v}%`,
    },
    {
      field: "event_date",
      headerName: "Event Date",
      width: 200,
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: "Details",
      color: "primary",
      onClick: (row) => router.push(`/backend/events/${row.id}`),
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.EventAdmin]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">Events</Typography>
          </Grid>
          <Grid>
            <Button onClick={() => setCreateEventModalOpen(true)}>
              <Add />
              &nbsp; Create
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <EntityList
          rows={data ?? []}
          columns={cols}
          loading={isLoading}
          rowActions={rowActions}
        />
        {createEventModalOpen && (
          <CreateEventModal onClose={() => setCreateEventModalOpen(false)} />
        )}
      </Stack>
    </RoleWrapper>
  );
};

export default EventsPage;
