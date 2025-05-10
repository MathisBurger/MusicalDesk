import { MembershipPaid } from "@/hooks/queries/membership/useUserPaidMemberships";
import { CreateMemberPaymentRequest } from "@/types/api/membership";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const payMembership = async (
  data: CreateMemberPaymentRequest,
): Promise<MembershipPaid | null> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memberships`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!result.ok) {
    return null;
  }
  return (await result.json()) as MembershipPaid;
};

const usePayMembershipMutation = (year: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unpaidMemberships", year] });
      queryClient.invalidateQueries({ queryKey: ["paidMemberships", year] });
    },
  });
};

export default usePayMembershipMutation;
