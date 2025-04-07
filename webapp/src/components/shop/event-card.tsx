import { Event } from "@/hooks/queries/useEventsQuery";
import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/joy";
import { useMemo } from "react";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const dateString = useMemo<string>(() => {
    const date: Date = new Date(event.event_date);
    return `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;
  }, [event.event_date]);

  return (
    <Card
      variant="outlined"
      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <AspectRatio ratio="1/1">
        <img
          alt=""
          src={`${process.env.NEXT_PUBLIC_API_URL}/images/${event.image_id}`}
        />
      </AspectRatio>
      <CardContent>
        <Stack justifyContent="space-between" sx={{ height: "100%" }}>
          <Typography level="h4">{event.name}</Typography>
          <Typography color="neutral">{dateString}</Typography>
          <Typography fontWeight="bold">{event.price}€</Typography>
        </Stack>
      </CardContent>
      <Button>Details</Button>
    </Card>
  );
};

export default EventCard;
