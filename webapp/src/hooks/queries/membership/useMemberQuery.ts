import { useQuery } from "@tanstack/react-query";
import { Member } from "./useMembersQuery";

const queryMember = async (id: number): Promise<Member | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/${id}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Member | null;
  }
  return null;
};

const useMemberQuery = (id: number) =>
  useQuery({ queryFn: () => queryMember(id), queryKey: ["member", id] });

export default useMemberQuery;
