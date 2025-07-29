import { Button, Card, Typography } from "@mui/joy";
import QrCode from "../qr-code";
import { useRouter } from "next/navigation";
import { UserTicketWithQrCode } from "@/types/api/event";
import { useTranslations } from "next-intl";

interface TicketCardProps {
  ticket: UserTicketWithQrCode;
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Card variant="outlined">
      <QrCode content={ticket.qr_content} />
      <Typography level="h4">{ticket.event_name}</Typography>
      <Typography>{ticket.valid_until}</Typography>
      <Button
        size="sm"
        onClick={() => router.push(`/shop/my-tickets/${ticket.id}`)}
      >
        {t("generic.details")}
      </Button>
    </Card>
  );
};

export default TicketCard;
