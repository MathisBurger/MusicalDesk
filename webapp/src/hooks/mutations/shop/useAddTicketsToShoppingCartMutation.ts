import { ShoppingCartRequest, Ticket } from "@/types/api/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addToCart = async (data: ShoppingCartRequest): Promise<Ticket[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shop/shopping_cart`,
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
    return [];
  }
  return (await result.json()) as Ticket[];
};

const useAddTicketsToShoppingCartMutation = (data: ShoppingCartRequest) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopEvents"] });
      queryClient.invalidateQueries({ queryKey: ["shoppingCart"] });
      queryClient.invalidateQueries({
        queryKey: ["shopEvents", data.event_id],
      });
    },
  });
};

export default useAddTicketsToShoppingCartMutation;
