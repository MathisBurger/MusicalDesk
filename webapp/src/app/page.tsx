"use client";

import ShopEventList from "@/components/shop/event-list";
import ShopHeader from "@/components/shop/header";
import { Container, Stack, Typography } from "@mui/joy";

export default function Home() {
  return (
    <>
      <ShopHeader />
      <Container>
        <Stack spacing={2} alignItems="center">
          <Typography level="h1" sx={{ fontSize: "3.5em" }}>
            Event ticket shop
          </Typography>
          <ShopEventList />
        </Stack>
      </Container>
    </>
  );
}
