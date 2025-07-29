import { AspectRatio, Card, Grid, Stack, Typography } from "@mui/joy";
import AztecCode from "../qr-code";
import { useMemo } from "react";
import KvList, { DisplayedData } from "../kv-list";
import BackButton from "../back-button";
import useUserQuery from "@/hooks/queries/user/useUserQuery";
import LoadingComponent from "../loading";
import { UserTicket, UserTicketWithQrCode } from "@/types/api/event";
import { useTranslations } from "next-intl";

interface TicketDetailsProps {
  ticket: UserTicketWithQrCode | UserTicket;
  hasQrCode?: boolean;
  isShop: boolean;
}

const TicketDetails = ({ ticket, hasQrCode = true }: TicketDetailsProps) => {
  const t = useTranslations();
  const { data: user, isLoading } = useUserQuery(
    ticket.owner_id ?? 0,
    !!ticket.owner_id,
  );

  const displayedData = useMemo<DisplayedData[]>(
    () => [
      {
        title: t("labels.events.ticket.validUntil"),
        value: ticket.valid_until,
      },
      {
        title: t("labels.events.ticket.invalidatedAt"),
        value: ticket.invalidated_at ?? "<never>",
      },
      {
        title: t("labels.events.ticket.boughtAt"),
        value: ticket.bought_at ?? "<never>",
      },
      {
        title: t("labels.events.ticket.owner"),
        value: isLoading ? <LoadingComponent /> : user?.username,
      },
    ],
    [ticket, user, isLoading],
  );

  return (
    <Stack spacing={2}>
      <BackButton />
      <Grid container direction="row" spacing={4} sx={{ marginTop: "2em" }}>
        {hasQrCode && (
          <Grid xs={12} md={6}>
            <Card
              variant="outlined"
              sx={{ display: "grid", placeItems: "center" }}
            >
              <Stack spacing={2} sx={{ width: "65%" }}>
                <AztecCode
                  content={(ticket as UserTicketWithQrCode).qr_content}
                />
              </Stack>
            </Card>
          </Grid>
        )}
        <Grid xs={12} md={6}>
          <Card variant="outlined">
            <Stack spacing={2}>
              <Typography level="h2">{ticket.event_name}</Typography>
              <AspectRatio ratio="1/1" sx={{ width: "50%" }}>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/images/${ticket.event_image_id}`}
                />
              </AspectRatio>
              <KvList displayData={displayedData} />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default TicketDetails;
