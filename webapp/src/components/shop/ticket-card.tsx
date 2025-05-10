import { Button, Card, Typography } from "@mui/joy";
import QrCode from "../qr-code";
import { useRouter } from "next/navigation";
import { UserTicketWithQrCode } from "@/types/api/event";

interface TicketCardProps {
  ticket: UserTicketWithQrCode;
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  const router = useRouter();

  return (
    <Card variant="outlined">
      <QrCode content={ticket.qr_content} />
      <Typography level="h4">{ticket.event_name}</Typography>
      <Typography>{ticket.valid_until}</Typography>
      <Button
        size="sm"
        onClick={() => router.push(`/shop/my-tickets/${ticket.id}`)}
      >
        Details
      </Button>
    </Card>
  );
};

export default TicketCard;
