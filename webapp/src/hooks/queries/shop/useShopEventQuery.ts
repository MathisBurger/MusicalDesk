import { ShopEvent } from "@/types/api/event";
import { useQuery } from "@tanstack/react-query";

const queryEvent = async (id: number): Promise<ShopEvent | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shop/events/${id}`,
    {
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as ShopEvent;
  }
  return null;
};

const useShopEventQuery = (id: number) =>
  useQuery({ queryFn: () => queryEvent(id), queryKey: ["shopEvents", id] });

export default useShopEventQuery;
