import { Event } from "@/types/api/event";
import { useQuery } from "@tanstack/react-query";

const queryEvents = async (): Promise<Event[]> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    credentials: "include",
    mode: "cors",
    headers: {
      Accept: "application/json",
    },
  });
  if (result.ok) {
    return (await result.json()) as Event[];
  }
  return [];
};

const useEventsQuery = () =>
  useQuery({ queryFn: queryEvents, queryKey: ["events"] });

export default useEventsQuery;
