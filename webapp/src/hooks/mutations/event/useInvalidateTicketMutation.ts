import { UserTicket } from "@/hooks/queries/shop/useCurrentUserTicketsQuery";
import { useMutation } from "@tanstack/react-query";

export interface QrCodeRequest {
  qr_content: string;
}

const invalidate = async (
  requestData: QrCodeRequest,
): Promise<UserTicket | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tickets/invalidate`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(requestData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as UserTicket;
  }
  return null;
};

const useInvalidateTicketMutation = () => {
  return useMutation({
    mutationFn: invalidate,
  });
};

export default useInvalidateTicketMutation;
