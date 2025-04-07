import { Event } from "@/hooks/queries/useEventsQuery";
import { Card, Grid, Typography } from "@mui/joy";
import { useMemo } from "react";
import KvList, { DisplayedData } from "../kv-list";

interface CoreDataTabProps {
  event: Event;
}

const CoreDataTab = ({ event }: CoreDataTabProps) => {
  const displayData = useMemo<DisplayedData[]>(
    () => [
      {
        title: "Price",
        value: event.price,
      },
      {
        title: "Tax",
        value: event.tax_percentage,
      },
      {
        title: "Event date",
        value: event.event_date.toLocaleString(),
      },
      {
        title: "Active from",
        value: event.active_from?.toLocaleString(),
      },
      {
        title: "Active until",
        value: event.active_until?.toLocaleString(),
      },
    ],
    [event],
  );

  const eventImage = useMemo<string>(
    () => `${process.env.NEXT_PUBLIC_API_URL}/images/${event.image_id}`,
    [event],
  );

  return (
    <Grid container direction="row" spacing={4}>
      <Grid xs={6}>
        <Card>
          <Typography level="h3">Core data</Typography>
          <KvList displayData={displayData} />
        </Card>
      </Grid>
      <Grid xs={6}>
        <Card>
          <Typography level="h3">Additional data</Typography>
          <img src={eventImage} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default CoreDataTab;
