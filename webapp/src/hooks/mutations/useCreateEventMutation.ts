import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormType } from "@/form/types";

export interface CreateEventRequest extends FormType {
  name: string | null;
  price: number | null;
  tax_percentage: number;
  image_id: number;
  event_date: string | null;
  active_from: string | null;
  active_until: string | null;
}

const createEvent = async (data: CreateEventRequest): Promise<Event | null> => {
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
