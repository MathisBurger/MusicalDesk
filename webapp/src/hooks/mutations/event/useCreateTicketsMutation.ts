import { CreateTicketsRequest } from "@/types/api/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createTickets = async (
  eventId: number,
  requestData: CreateTicketsRequest,
): Promise<boolean> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/tickets`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(requestData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  return result.ok;
};

const useCreateTicketsMutation = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketsRequest) => createTickets(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventTickets", eventId] });
    },
  });
};

export default useCreateTicketsMutation;
