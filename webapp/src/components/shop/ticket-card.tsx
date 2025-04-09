import { UserTicketWithAztec } from "@/hooks/queries/shop/useCurrentUserTicketsQuery";
import { Button, Card, Typography } from "@mui/joy";
import AztecCode from "../aztec-code";
import { useRouter } from "next/navigation";

interface TicketCardProps {
  ticket: UserTicketWithAztec;
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  const router = useRouter();

  return (
    <Card variant="outlined">
      <AztecCode content={ticket.aztec_content} />
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
