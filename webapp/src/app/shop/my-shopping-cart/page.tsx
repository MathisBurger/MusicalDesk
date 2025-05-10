"use client";
import BackButton from "@/components/back-button";
import LoadingComponent from "@/components/loading";
import ShoppingCartEntry from "@/components/shop/shopping-cart-entry";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useCheckoutMutation from "@/hooks/mutations/shop/useCheckoutMutation";
import useCurrentCheckoutSessionQuery from "@/hooks/queries/shop/useCurrentCheckoutSessionQuery";
import useShoppingCartQuery from "@/hooks/queries/shop/useShoppingCartQuery";
import { UserRole } from "@/types/api/user";
import { Button, Card, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const MyShoppingCartPage = () => {
  const { data, isLoading } = useShoppingCartQuery();
  const { data: currentCheckoutSession, isLoading: currentSessionLoading } =
    useCurrentCheckoutSessionQuery();
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

  if (isLoading || currentSessionLoading) {
    return <LoadingComponent />;
  }

  return (
    <RoleWrapper roles={[UserRole.ShopCustomer]}>
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
          {currentCheckoutSession && (
            <Button
              onClick={() =>
                router.replace(currentCheckoutSession.checkout_uri)
              }
            >
              Continue current checkout
            </Button>
          )}
          <Button
            disabled={total === 0 || !!currentCheckoutSession}
            loading={isPending}
            onClick={checkout}
          >
            {" "}
            Proceed with Checkout
          </Button>
        </Card>
      </Stack>
    </RoleWrapper>
  );
};

export default MyShoppingCartPage;
