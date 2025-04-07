import { useQuery } from "@tanstack/react-query";
import { Event } from "../useEventsQuery";

const queryEvents = async (): Promise<Event[]> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/events`, {
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

const useShopEventsQuery = () =>
  useQuery({ queryFn: queryEvents, queryKey: ["shopEvents"] });

export default useShopEventsQuery;
