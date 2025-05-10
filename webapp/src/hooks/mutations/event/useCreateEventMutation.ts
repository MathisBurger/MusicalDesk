import { EventRequest } from "@/types/api/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createEvent = async (data: EventRequest): Promise<Event | null> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!result.ok) {
    return null;
  }
  return (await result.json()) as Event;
};

const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export default useCreateEventMutation;
