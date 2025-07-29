import useDashboardEventsQuery from "@/hooks/queries/event/useDashboardEventsQuery";
import useDashboardTicketCountQuery from "@/hooks/queries/event/useDashboardTicketCountQuery";
import { Card, Grid, Stack, Typography } from "@mui/joy";
import { GridColDef } from "@mui/x-data-grid";
import EntityList from "../entity-list";
import { useTranslations } from "next-intl";

const EventDashboardTile = () => {
  const t = useTranslations();
  const { data: eventData, isLoading: eventLoading } =
    useDashboardEventsQuery();
  const { data: ticketCount } = useDashboardTicketCountQuery();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: t("generic.id"),
    },
    {
      field: "name",
      headerName: t("labels.events.name"),
      width: 200,
    },
    {
      field: "price",
      headerName: t("labels.events.price"),
      width: 120,
      valueFormatter: (v) => `${v}€`,
    },
    {
      field: "tax_percentage",
      headerName: t("labels.events.tax"),
      valueFormatter: (v) => `${v}%`,
    },
    {
      field: "event_date",
      headerName: t("labels.events.eventDate"),
      width: 200,
    },
  ];

  return (
    <>
      <Grid xs={9}>
        <Card>
          <Stack spacing={2}>
            <Typography>
              {t("labels.events.dashboard.lastThreeEvents")}
            </Typography>
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
            <Typography>
              {t("labels.events.dashboard.totalTicketCount")}
            </Typography>
            <Typography level="h2">{ticketCount?.total}</Typography>
          </Stack>
        </Card>
      </Grid>
    </>
  );
};

export default EventDashboardTile;
