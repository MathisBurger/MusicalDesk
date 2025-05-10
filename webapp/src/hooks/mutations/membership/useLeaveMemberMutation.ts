import { Member } from "@/types/api/membership";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const leaveMember = async (memberId: number): Promise<Member | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/${memberId}/leave`,
    {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  if (!result.ok) {
    return null;
  }
  return (await result.json()) as Member;
};

const useLeaveMemberMutation = (memberId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", memberId] });
    },
  });
};

export default useLeaveMemberMutation;
