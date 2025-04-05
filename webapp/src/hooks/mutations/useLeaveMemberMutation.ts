import { useMutation } from "@tanstack/react-query";
import { Member } from "../queries/useMembersQuery";

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

const useLeaveMemberMutation = () => useMutation({ mutationFn: leaveMember });

export default useLeaveMemberMutation;
