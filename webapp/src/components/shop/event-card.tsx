import { ShopEvent } from "@/hooks/queries/shop/useShopEventQuery";
import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface EventCardProps {
  event: ShopEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const router = useRouter();

  const dateString = useMemo<string>(() => {
    const date: Date = new Date(event.event.event_date);
    return `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;
  }, [event.event.event_date]);

  return (
    <Card
      variant="outlined"
      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <AspectRatio ratio="1/1">
        <img
          alt=""
          src={`${process.env.NEXT_PUBLIC_API_URL}/images/${event.event.image_id}`}
        />
      </AspectRatio>
      <CardContent>
        <Stack justifyContent="space-between" sx={{ height: "100%" }}>
          <Typography level="h4">{event.event.name}</Typography>
          <Typography color="neutral">{dateString}</Typography>
          <Typography
            fontWeight={event.tickets_left === 0 ? "bold" : undefined}
          >
            {event.tickets_left > 0 ? `${event.tickets_left} left` : "sold out"}
          </Typography>
          <Typography fontWeight="bold">{event.event.price}€</Typography>
        </Stack>
      </CardContent>
      <Button onClick={() => router.push(`/shop/events/${event.event.id}`)}>
        Details
      </Button>
    </Card>
  );
};

export default EventCard;
