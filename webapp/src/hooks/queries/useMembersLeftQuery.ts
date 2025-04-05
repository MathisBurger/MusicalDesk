import { useQuery } from "@tanstack/react-query";
import { Member } from "./useMembersQuery";

const queryMembers = async (): Promise<Member[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members_left`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Member[];
  }
  return [];
};

const useMembersLeftQuery = () =>
  useQuery({ queryFn: queryMembers, queryKey: ["membersLeft"] });

export default useMembersLeftQuery;
