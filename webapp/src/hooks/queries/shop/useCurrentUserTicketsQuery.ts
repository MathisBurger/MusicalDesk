import { UserTicketWithQrCode } from "@/types/api/event";
import { useQuery } from "@tanstack/react-query";

const queryTickets = async (): Promise<UserTicketWithQrCode[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shop/tickets/current`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as UserTicketWithQrCode[];
  }
  return [];
};

const useCurrentUserTicketsQuery = () =>
  useQuery({ queryFn: queryTickets, queryKey: ["currentUserTickets"] });

export default useCurrentUserTicketsQuery;
