import { UserTicketWithQrCode } from "@/hooks/queries/shop/useCurrentUserTicketsQuery";
import { AspectRatio, Card, Grid, Stack, Typography } from "@mui/joy";
import AztecCode from "../qr-code";
import { useMemo } from "react";
import KvList, { DisplayedData } from "../kv-list";
import BackButton from "../back-button";

interface TicketDetailsProps {
  ticket: UserTicketWithQrCode;
  isShop: boolean;
}

const TicketDetails = ({ ticket }: TicketDetailsProps) => {
  const displayedData = useMemo<DisplayedData[]>(
    () => [
      {
        title: "Valid until",
        value: ticket.valid_until,
      },
      {
        title: "Invalidated at",
        value: ticket.invalidated_at ?? "<never>",
      },
      {
        title: "Bought at",
        value: ticket.bought_at ?? "<never>",
      },
    ],
    [ticket],
  );

  return (
    <Stack spacing={2}>
      <BackButton />
      <Grid container direction="row" spacing={4} sx={{ marginTop: "2em" }}>
        <Grid xs={12} md={6}>
          <Card
            variant="outlined"
            sx={{ display: "grid", placeItems: "center" }}
          >
            <Stack spacing={2} sx={{ width: "65%" }}>
              <AztecCode content={ticket.qr_content} />
            </Stack>
          </Card>
        </Grid>
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
