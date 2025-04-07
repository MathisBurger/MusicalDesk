"use client";
import BackButton from "@/components/back-button";
import LoadingComponent from "@/components/loading";
import ShopHeader from "@/components/shop/header";
import useAddTicketsToShoppingCartMutation from "@/hooks/mutations/shop/useAddTicketsToShoppingCartMutation";
import useShopEventQuery from "@/hooks/queries/shop/useShopEventQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Add, Remove } from "@mui/icons-material";
import {
  AspectRatio,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ShopEventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const [numSelected, setNumSelected] = useState<number>(1);

  const { data, isLoading } = useShopEventQuery(parseInt(id, 10));

  const { mutateAsync, isPending } = useAddTicketsToShoppingCartMutation({
    event_id: parseInt(id, 10),
    quantity: numSelected,
  });

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
    <>
      <ShopHeader />
      <Container sx={{ marginTop: "4em" }}>
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
                {ticketsLeft > 0 ? `${ticketsLeft} left` : "sold out"}
              </Typography>
              {ticketsLeft > 0 && currentUser === null && (
                <Button
                  onClick={() => router.push(`/login?redirect_uri=${pathname}`)}
                >
                  Login to buy
                </Button>
              )}
              {ticketsLeft > 0 && currentUser && (
                <Stack direction="row" spacing={2}>
                  <Button>Buy now</Button>
                  <Button
                    variant="outlined"
                    onClick={() => mutateAsync()}
                    loading={isPending}
                  >
                    Add to shopping cart
                  </Button>
                </Stack>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ShopEventDetailsPage;
