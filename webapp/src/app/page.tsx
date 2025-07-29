"use client";

import ShopEventList from "@/components/shop/event-list";
import { Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <Stack spacing={2} alignItems="center">
      <Typography level="h1" sx={{ fontSize: "3.5em" }}>
        {t("headings.eventTicketShop")}
      </Typography>
      <ShopEventList />
    </Stack>
  );
}
