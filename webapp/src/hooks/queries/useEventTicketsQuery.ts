import { useQuery } from "@tanstack/react-query";

export interface Ticket {
  id: number;
  event_id: number;
  valid_until: Date;
  invalidated: boolean;
  invalidated_at: Date | null;
}

const queryTickets = async (eventId: number): Promise<Ticket[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/tickets`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Ticket[];
  }
  return [];
};

const useEventTicketsQuery = (eventId: number) =>
  useQuery({
    queryFn: () => queryTickets(eventId),
    queryKey: ["eventTickets", eventId],
  });

export default useEventTicketsQuery;
