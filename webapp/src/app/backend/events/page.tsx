"use client";
import { Add } from "@mui/icons-material";
import { Button, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useState } from "react";

const EventsPage = () => {
  const [createEventModalOpen, setCreateEventModalOpen] =
    useState<boolean>(false);

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
    </Stack>
  );
};

export default EventsPage;
