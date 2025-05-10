import { EventRequest } from "@/types/api/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateEvent = async (
  data: EventRequest,
  eventId: number,
): Promise<Event | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  if (!result.ok) {
    return null;
  }
  return (await result.json()) as Event;
};

const useUpdateEventMutation = (eventID: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: EventRequest) => updateEvent(req, eventID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventID] });
    },
  });
};

export default useUpdateEventMutation;
