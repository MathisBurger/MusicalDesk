"use client";
import BackButton from "@/components/back-button";
import LoadingComponent from "@/components/loading";
import useAddTicketsToShoppingCartMutation from "@/hooks/mutations/shop/useAddTicketsToShoppingCartMutation";
import useCheckoutMutation from "@/hooks/mutations/shop/useCheckoutMutation";
import useShopEventQuery from "@/hooks/queries/shop/useShopEventQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Add, Remove } from "@mui/icons-material";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ShopEventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();
  const currentUser = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const [numSelected, setNumSelected] = useState<number>(1);

  const { data, isLoading } = useShopEventQuery(parseInt(id, 10));

  const { mutateAsync, isPending } = useAddTicketsToShoppingCartMutation({
    event_id: parseInt(id, 10),
    quantity: numSelected,
  });
  const { mutateAsync: checkoutMutate, isPending: checkoutPending } =
    useCheckoutMutation();

  const buyNow = async () => {
    const res = await mutateAsync();
    if (res.length > 0) {
      const checkoutRes = await checkoutMutate();
      if (checkoutRes) {
        router.replace(checkoutRes.checkout_uri);
      }
    }
  };

  const changeNum = (num: number) => {
    if (num < 1) {
      setNumSelected(1);
    } else if (num > ticketsLeft) {
      setNumSelected(ticketsLeft);
    } else if (isNaN(num)) {
      setNumSelected(1);
    } else {
      setNumSelected(num);
    }
  };

  const ticketsLeft = useMemo(
    () => data?.tickets_left ?? 0,
    [data?.tickets_left],
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Box sx={{ marginTop: "2em" }}>
      <BackButton />
      <Grid container direction="row" spacing={4} sx={{ marginTop: "10px" }}>
        <Grid xs={12} md={6}>
          <AspectRatio ratio="1/1">
            <img
              alt=""
              src={`${process.env.NEXT_PUBLIC_API_URL}/images/${data?.event.image_id}`}
            />
          </AspectRatio>
        </Grid>
        <Grid xs={12} md={6}>
          <Card variant="outlined">
            <Typography level="h2">{data?.event.name}</Typography>
            <Divider />
            <Typography level="h3">
              {data?.event.price}€ &nbsp;{" "}
              <Typography fontSize="0.5em">
                inkl. {data?.event.tax_percentage}% VAT
              </Typography>
            </Typography>
            {ticketsLeft > 0 && (
              <Stack direction="row" spacing={1} sx={{ width: "250px" }}>
                <Button
                  color="neutral"
                  variant="outlined"
                  onClick={() => changeNum(numSelected - 1)}
                >
                  <Remove />
                </Button>
                <Input
                  type="number"
                  endDecorator="st."
                  value={numSelected}
                  onChange={(e) => changeNum(parseInt(e.target.value, 10))}
                />
                <Button
                  color="neutral"
                  variant="outlined"
                  onClick={() => changeNum(numSelected + 1)}
                >
                  <Add />
                </Button>
              </Stack>
            )}
            <Typography fontWeight={ticketsLeft === 0 ? "bold" : undefined}>
              {ticketsLeft > 0
                ? `${ticketsLeft} ${t("labels.shop.left")}`
                : t("labels.shop.soldOut")}
            </Typography>
            {ticketsLeft > 0 && currentUser === null && (
              <Button
                onClick={() => router.push(`/login?redirect_uri=${pathname}`)}
              >
                {t("actions.shop.loginToBuy")}
              </Button>
            )}
            {ticketsLeft > 0 && currentUser && (
              <Stack direction="row" spacing={2}>
                <Button loading={isPending || checkoutPending} onClick={buyNow}>
                  {t("actions.shop.buyNow")}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => mutateAsync()}
                  loading={isPending}
                >
                  {t("actions.shop.addToShoppingCart")}
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShopEventDetailsPage;
