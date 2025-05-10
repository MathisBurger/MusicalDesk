import { ShoppingCartItem } from "@/types/api/event";
import { useQuery } from "@tanstack/react-query";

const queryShoppingCart = async (): Promise<ShoppingCartItem[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shop/shopping_cart`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as ShoppingCartItem[];
  }
  return [];
};

const useShoppingCartQuery = () =>
  useQuery({ queryFn: queryShoppingCart, queryKey: ["shoppingCart"] });

export default useShoppingCartQuery;
