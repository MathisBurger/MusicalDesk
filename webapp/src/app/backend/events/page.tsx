"use client";
import EntityList from "@/components/entity-list";
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
    },
    {
      field: "price",
      headerName: "Price",
    },
    {
      field: "tax_percentage",
      headerName: "Tax",
    },
    {
      field: "event_date",
      headerName: "Event Date",
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
    </Stack>
  );
};

export default EventsPage;
