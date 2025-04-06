"use client";
import EntityList from "@/components/entity-list";
import CreateEventModal from "@/components/events/modal/create-event";
import useEventsQuery from "@/hooks/queries/useEventsQuery";
import { Add } from "@mui/icons-material";
import { Button, Divider, Grid, Stack, Typography } from "@mui/joy";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

const EventsPage = () => {
  const [createEventModalOpen, setCreateEventModalOpen] =
    useState<boolean>(false);

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

  return (
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
      <EntityList rows={data ?? []} columns={cols} loading={isLoading} />
      {createEventModalOpen && (
        <CreateEventModal onClose={() => setCreateEventModalOpen(false)} />
      )}
    </Stack>
  );
};

export default EventsPage;
