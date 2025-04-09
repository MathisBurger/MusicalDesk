import { useQuery } from "@tanstack/react-query";
import { UserTicketWithAztec } from "./shop/useCurrentUserTicketsQuery";

const queryTicket = async (id: number): Promise<UserTicketWithAztec | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as UserTicketWithAztec | null;
  }
  return null;
};

const useUserTicketQuery = (id: number) =>
  useQuery({ queryFn: () => queryTicket(id), queryKey: ["userTicket", id] });

export default useUserTicketQuery;
