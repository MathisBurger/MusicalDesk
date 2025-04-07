"use client";
import LoadingComponent from "@/components/loading";
import ShopHeader from "@/components/shop/header";
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
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const ShopEventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useCurrentUser();

  const { data, isLoading } = useShopEventQuery(parseInt(id, 10));

  const [numSelected, setNumSelected] = useState<number>(1);
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
        <Grid container direction="row" spacing={4}>
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
              <Stack direction="row" spacing={1} sx={{ width: "250px" }}>
                <Button
                  color="neutral"
                  variant="outlined"
                  onClick={() => setNumSelected(numSelected - 1)}
                >
                  <Remove />
                </Button>
                <Input
                  type="number"
                  endDecorator="st."
                  value={numSelected}
                  onChange={(e) => setNumSelected(parseInt(e.target.value, 10))}
                />
                <Button
                  color="neutral"
                  variant="outlined"
                  onClick={() => setNumSelected(numSelected + 1)}
                >
                  <Add />
                </Button>
              </Stack>
              <Typography fontWeight={ticketsLeft === 0 ? "bold" : undefined}>
                {ticketsLeft > 0 ? `${ticketsLeft} left` : "sold out"}
              </Typography>
              {currentUser === null && <Button>Login to buy</Button>}
              {currentUser && (
                <Stack direction="row" spacing={2}>
                  <Button>Buy now</Button>
                  <Button variant="outlined">Add to shopping cart</Button>
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
