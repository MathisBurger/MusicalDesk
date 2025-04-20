import { useQuery } from "@tanstack/react-query";

export interface Event {
  id: number;
  name: string;
  price: number;
  tax_percentage: number;
  image_id: number | null;
  event_date: Date | string;
  active_from: Date | null;
  active_until: Date | null;
}

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
