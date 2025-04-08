"use client";
import BackButton from "@/components/back-button";
import LoadingComponent from "@/components/loading";
import ShoppingCartEntry from "@/components/shop/shopping-cart-entry";
import useCheckoutMutation from "@/hooks/mutations/shop/useCheckoutMutation";
import useShoppingCartQuery from "@/hooks/queries/shop/useShoppingCartQuery";
import { Button, Card, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const MyShoppingCartPage = () => {
  const { data, isLoading } = useShoppingCartQuery();
  const { mutateAsync, isPending } = useCheckoutMutation();
  const router = useRouter();

  const checkout = async () => {
    const res = await mutateAsync();
    if (res) {
      router.replace(res.checkout_uri);
    }
  };

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
        <Button disabled={total === 0} loading={isPending} onClick={checkout}>
          {" "}
          Proceed with Checkout
        </Button>
      </Card>
    </Stack>
  );
};

export default MyShoppingCartPage;
