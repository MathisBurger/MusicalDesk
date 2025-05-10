import { UserTicketWithQrCode } from "@/types/api/event";
import { useQuery } from "@tanstack/react-query";

const queryTickets = async (): Promise<UserTicketWithQrCode[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shop/tickets/old`,
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

const useOldUserTicketsQuery = () =>
  useQuery({ queryFn: queryTickets, queryKey: ["oldUserTickets"] });

export default useOldUserTicketsQuery;
