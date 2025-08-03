import { Card, Grid, Typography } from "@mui/joy";
import { useMemo } from "react";
import KvList, { DisplayedData } from "../kv-list";
import { Event } from "@/types/api/event";
import { useTranslations } from "next-intl";

interface CoreDataTabProps {
  event: Event;
}

const CoreDataTab = ({ event }: CoreDataTabProps) => {
  const t = useTranslations();

  const displayData = useMemo<DisplayedData[]>(
    () => [
      {
        title: t("labels.events.price"),
        value: event.price,
      },
      {
        title: t("labels.events.tax"),
        value: event.tax_percentage,
      },
      {
        title: t("labels.events.eventDate"),
        value: event.event_date.toLocaleString(),
      },
      {
        title: t("labels.events.description"),
        value: event.description,
      },
      {
        title: t("labels.events.upperReservationLimit"),
        value: event.upper_reservation_limit,
      },
      {
        title: t("labels.events.activeFrom"),
        value: event.active_from?.toLocaleString(),
      },
      {
        title: t("labels.events.activeUntil"),
        value: event.active_until?.toLocaleString(),
      },
    ],
    [event, t],
  );

  const eventImage = useMemo<string>(
    () => `${process.env.NEXT_PUBLIC_API_URL}/images/${event.image_id}`,
    [event],
  );

  return (
    <Grid container direction="row" spacing={4}>
      <Grid xs={12} md={6}>
        <Card>
          <Typography level="h3">{t("headings.coreData")}</Typography>
          <KvList displayData={displayData} />
        </Card>
      </Grid>
      <Grid xs={12} md={6}>
        <Card>
          <Typography level="h3">{t("headings.additionalData")}</Typography>
          <img src={eventImage} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default CoreDataTab;
