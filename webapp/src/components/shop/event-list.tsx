import useShopEventsQuery from "@/hooks/queries/shop/useShopEventsQuery";
import { Alert, Grid } from "@mui/joy";
import EventCardSkeleton from "./event-card-skeleton";
import EventCard from "./event-card";

const ShopEventList = () => {
  const { data, isLoading } = useShopEventsQuery();

  return (
    <Grid container direction="row" spacing={2}>
      {isLoading && (
        <>
          <Grid xs={12} md={4}>
            <EventCardSkeleton />
          </Grid>
          <Grid xs={12} md={4}>
            <EventCardSkeleton />
          </Grid>
          <Grid xs={12} md={4}>
            <EventCardSkeleton />
          </Grid>
        </>
      )}
      {(data ?? []).map((event) => (
        <Grid xs={12} md={4} key={event.id} sx={{ display: "flex" }}>
          <EventCard event={event} />
        </Grid>
      ))}
      {(data ?? []).length === 0 && !isLoading && (
        <Alert variant="soft" color="primary" size="lg">
          There are no current events
        </Alert>
      )}
    </Grid>
  );
};

export default ShopEventList;
