import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditMemberRequest, Member } from "@/types/api/membership";

const editMember = async (
  data: EditMemberRequest & { id: number },
): Promise<Member | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/${data.id}`,
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
    return null;
  }
  return (await result.json()) as Member;
};

const useEditMemberMutation = (memberId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", memberId] });
    },
  });
};

export default useEditMemberMutation;
