"use client";

import ShopEventList from "@/components/shop/event-list";
import { Stack, Typography } from "@mui/joy";

export default function Home() {
  return (
    <Stack spacing={2} alignItems="center">
      <Typography level="h1" sx={{ fontSize: "3.5em" }}>
        Event ticket shop
      </Typography>
      <ShopEventList />
    </Stack>
  );
}
