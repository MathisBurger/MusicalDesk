import { QrCodeRequest, UserTicket } from "@/types/api/event";
import { useMutation } from "@tanstack/react-query";

const getTicket = async (
  requestData: QrCodeRequest,
): Promise<UserTicket | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tickets/view_by_qr_code`,
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

const useTicketByQrCodeMutation = () => {
  return useMutation({
    mutationFn: getTicket,
  });
};

export default useTicketByQrCodeMutation;
