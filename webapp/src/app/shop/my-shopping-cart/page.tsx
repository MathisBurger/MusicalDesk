"use client";
import BackButton from "@/components/back-button";
import LoadingComponent from "@/components/loading";
import ShoppingCartEntry from "@/components/shop/shopping-cart-entry";
import useShoppingCartQuery from "@/hooks/queries/shop/useShoppingCartQuery";
import { Button, Card, Stack, Typography } from "@mui/joy";
import { useMemo } from "react";

const MyShoppingCartPage = () => {
  const { data, isLoading } = useShoppingCartQuery();

  const total = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((item) => item.total_price).reduce((a, b) => a + b);
    }
    return 0;
  }, [data]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Stack spacing={2} sx={{ marginTop: "2em" }}>
      <BackButton />
      <Typography level="h1">Shopping cart</Typography>
      {(data ?? []).map((item) => (
        <ShoppingCartEntry item={item} key={item.event_id} />
      ))}
      <Card variant="soft" color="primary">
        <Typography level="h4" fontWeight="bold">
          Total: {total}€
        </Typography>
        <Button disabled={total === 0}> Proceed with Checkout</Button>
      </Card>
    </Stack>
  );
};

export default MyShoppingCartPage;
