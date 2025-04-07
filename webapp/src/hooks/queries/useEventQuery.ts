import { useQuery } from "@tanstack/react-query";
import { Event } from "./useEventsQuery";

const queryEvent = async (id: number): Promise<Event | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Event | null;
  }
  return null;
};

const useEventQuery = (id: number) =>
  useQuery({ queryFn: () => queryEvent(id), queryKey: ["event", id] });

export default useEventQuery;
