import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Member } from "../../queries/membership/useMembersQuery";
import { CreateMemberRequest } from "@/types/api/membership";

const createMember = async (
  data: CreateMemberRequest,
): Promise<Member | null> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members`, {
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
  return (await result.json()) as Member;
};

const useCreateMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membersLeft"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["paidMemberships"] });
      queryClient.invalidateQueries({ queryKey: ["unpaidMemberships"] });
    },
  });
};

export default useCreateMemberMutation;
