"use client";
import LoadingComponent from "@/components/loading";
import TicketCard from "@/components/shop/ticket-card";
import useCurrentUserTicketsQuery from "@/hooks/queries/shop/useCurrentUserTicketsQuery";
import useOldUserTicketsQuery from "@/hooks/queries/shop/useOldUserTicketsQuery";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";

const MyTicketsPage = () => {
  const { data: currentTickets, isLoading: currentTicketsLoading } =
    useCurrentUserTicketsQuery();
  const { data: oldTickets, isLoading: oldTicketsLoading } =
    useOldUserTicketsQuery();

  if (currentTicketsLoading || oldTicketsLoading) {
    return <LoadingComponent />;
  }

  return (
    <Stack spacing={2}>
      <Typography level="h1">My tickets</Typography>
      <Grid container direction="row" spacing={2}>
        {(currentTickets ?? []).map((ticket) => (
          <Grid xs={3} key={ticket.id}>
            <TicketCard ticket={ticket} />
          </Grid>
        ))}
        {(currentTickets ?? []).length === 0 && (
          <Alert variant="soft" color="warning" size="lg">
            No current tickets
          </Alert>
        )}
      </Grid>
      {(oldTickets ?? []).length > 0 && (
        <Accordion>
          <AccordionSummary>
            <Typography level="h3">Old tickets</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid
              container
              direction="row"
              spacing={4}
              sx={{ marginTop: "2em" }}
            >
              {(oldTickets ?? []).map((ticket) => (
                <Grid xs={3} key={ticket.id}>
                  <TicketCard ticket={ticket} />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
};

export default MyTicketsPage;
