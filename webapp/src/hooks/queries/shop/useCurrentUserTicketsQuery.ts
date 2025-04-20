import { useQuery } from "@tanstack/react-query";

export interface UserTicketWithQrCode {
  id: number;
  event_id: number;
  event_name: string;
  event_image_id: number;
  valid_until: string;
  invalidated: boolean;
  invalidated_at: string | null;
  owner_id: number;
  bought_at: string;
  qr_content: string;
}

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
