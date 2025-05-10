import { PaymentCheckoutResponse } from "@/types/api/event";
import { useQuery } from "@tanstack/react-query";

const queryCheckout = async (): Promise<PaymentCheckoutResponse | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shop/current_checkout_session`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as PaymentCheckoutResponse;
  }
  return null;
};

const useCurrentCheckoutSessionQuery = () =>
  useQuery({ queryFn: queryCheckout, queryKey: ["currentCheckoutSession"] });

export default useCurrentCheckoutSessionQuery;
