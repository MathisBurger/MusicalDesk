"use client";
import LoadingComponent from "@/components/loading";
import TicketDetails from "@/components/ticket/ticket-details";
import useUserTicketQuery from "@/hooks/queries/useUserTicketQuery";
import { Alert } from "@mui/joy";
import { useParams } from "next/navigation";

const MyTicketDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useUserTicketQuery(parseInt(id, 10));

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (data) {
    return <TicketDetails isShop ticket={data} />;
  }

  return (
    <Alert variant="soft" size="lg" color="danger">
      Ticket not found
    </Alert>
  );
};

export default MyTicketDetailsPage;
