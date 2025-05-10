import { PaymentCheckoutResponse } from "@/types/api/event";
import { useMutation } from "@tanstack/react-query";

const checkout = async (): Promise<PaymentCheckoutResponse | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shop/checkout`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
    },
  );
  if (!result.ok) {
    return null;
  }
  return (await result.json()) as PaymentCheckoutResponse;
};

const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: checkout,
  });
};

export default useCheckoutMutation;
