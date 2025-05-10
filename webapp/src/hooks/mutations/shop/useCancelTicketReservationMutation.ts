import { Ticket } from "@/types/api/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const cancelReservation = async (eventId: number): Promise<Ticket[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shop/shopping_cart/${eventId}`,
    {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (!result.ok) {
    return [];
  }
  return (await result.json()) as Ticket[];
};

const useCancelTicketReservationMutation = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelReservation(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopEvents"] });
      queryClient.invalidateQueries({ queryKey: ["shoppingCart"] });
      queryClient.invalidateQueries({
        queryKey: ["shopEvents", eventId],
      });
    },
  });
};

export default useCancelTicketReservationMutation;
