import { ShopEvent } from "@/types/api/event";
import { useQuery } from "@tanstack/react-query";

const queryEvents = async (): Promise<ShopEvent[]> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/events`, {
    mode: "cors",
    headers: {
      Accept: "application/json",
    },
  });
  if (result.ok) {
    return (await result.json()) as ShopEvent[];
  }
  return [];
};

const useShopEventsQuery = () =>
  useQuery({ queryFn: queryEvents, queryKey: ["shopEvents"] });

export default useShopEventsQuery;
