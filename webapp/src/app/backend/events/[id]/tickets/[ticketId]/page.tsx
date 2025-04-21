"use client";
import TicketDetails from "@/components/events/ticket-details";
import LoadingComponent from "@/components/loading";
import useUserTicketQuery from "@/hooks/queries/event/useUserTicketQuery";
import { Alert } from "@mui/joy";
import { useParams } from "next/navigation";

const TicketDetailsPage = () => {
  const { ticketId } = useParams<{ ticketId: string }>();

  const { data, isLoading } = useUserTicketQuery(parseInt(ticketId, 10));

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (data) {
    return <TicketDetails isShop={false} ticket={data} />;
  }

  return (
    <Alert variant="soft" size="lg" color="danger">
      Ticket not found
    </Alert>
  );
};

export default TicketDetailsPage;
