import useDashboardEventsQuery from "@/hooks/queries/event/useDashboardEventsQuery";
import useDashboardTicketCountQuery from "@/hooks/queries/event/useDashboardTicketCountQuery";
import { Card, Grid, Stack, Typography } from "@mui/joy";
import { GridColDef } from "@mui/x-data-grid";
import EntityList from "../entity-list";

const EventDashboardTile = () => {
  const { data: eventData, isLoading: eventLoading } =
    useDashboardEventsQuery();
  const { data: ticketCount } = useDashboardTicketCountQuery();

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
    <>
      <Grid xs={9}>
        <Card>
          <Stack spacing={2}>
            <Typography>Latest three events</Typography>
            <EntityList
              columns={cols}
              rows={eventData ?? []}
              loading={eventLoading}
            />
          </Stack>
        </Card>
      </Grid>
      <Grid xs={3}>
        <Card>
          <Stack spacing={2}>
            <Typography>Total ticket count</Typography>
            <Typography level="h2">{ticketCount?.total}</Typography>
          </Stack>
        </Card>
      </Grid>
    </>
  );
};

export default EventDashboardTile;
