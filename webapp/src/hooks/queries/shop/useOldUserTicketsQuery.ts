import { useQuery } from "@tanstack/react-query";
import { UserTicketWithAztec } from "./useCurrentUserTicketsQuery";

const queryTickets = async (): Promise<UserTicketWithAztec[]> => {
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
    return (await result.json()) as UserTicketWithAztec[];
  }
  return [];
};

const useOldUserTicketsQuery = () =>
  useQuery({ queryFn: queryTickets, queryKey: ["oldUserTickets"] });

export default useOldUserTicketsQuery;
