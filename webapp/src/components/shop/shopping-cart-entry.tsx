import useCancelTicketReservationMutation from "@/hooks/mutations/shop/useCancelTicketReservationMutation";
import { ShoppingCartItem } from "@/types/api/event";
import { AspectRatio, Button, Grid, Typography } from "@mui/joy";
import { Card } from "@mui/joy";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ShoppingCartEntryProps {
  item: ShoppingCartItem;
}

const padNum = (num: number): string => {
  if (num < 10) {
    return `0${num}`;
  }
  return `${num}`;
};

const getReservationTimeLeft = (
  time: Date | string,
  queryClient: QueryClient,
): string => {
  const diff = new Date(time).getTime() - new Date().getTime();
  if (diff < 1000) {
    queryClient.invalidateQueries({ queryKey: ["shoppingCart"] });
  }
  const diffDate = new Date(diff);
  return `${padNum(diffDate.getMinutes())}:${padNum(diffDate.getSeconds())}`;
};

const ShoppingCartEntry = ({ item }: ShoppingCartEntryProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCancelTicketReservationMutation(
    item.event_id,
  );

  const [reservationTimeLeft, setReservationTimeLeft] = useState<string>(
    getReservationTimeLeft(item.min_reserved_until, queryClient),
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        setReservationTimeLeft(
          getReservationTimeLeft(item.min_reserved_until, queryClient),
        ),
      1000,
    );

    return () => clearInterval(interval);
  });

  return (
    <Card variant="outlined">
      <Grid container spacing={2} direction="row" alignItems="center">
        <Grid xs={1}>
          <AspectRatio ratio="1/1" sx={{ width: "50px", height: "50px" }}>
            <img
              alt=""
              src={`${process.env.NEXT_PUBLIC_API_URL}/images/${item.image_id}`}
            />
          </AspectRatio>
        </Grid>
        <Grid xs={3}>
          <Typography level="h3">{item.name}</Typography>
        </Grid>
        <Grid xs={1}>
          <Typography>{item.count}</Typography>
        </Grid>
        <Grid xs={2}>
          <Typography>{item.total_price}€</Typography>
        </Grid>
        <Grid xs={2}>
          <Typography>{reservationTimeLeft}</Typography>
        </Grid>
        <Grid xs={2}>
          <Button color="danger" onClick={() => mutate()} loading={isPending}>
            Cancel reservation
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ShoppingCartEntry;
