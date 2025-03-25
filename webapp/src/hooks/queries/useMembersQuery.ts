import { useQuery } from "@tanstack/react-query";

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  street: string | null;
  house_nr: string | null;
  zip: string | null;
  city: string | null;
  iban: string | null;
  membership_fee: number | null;
  joined_at: string;
  left_at: string | null;
}

const queryMembers = async (): Promise<Member[]> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members`, {
    credentials: "include",
    mode: "cors",
    headers: {
      Accept: "application/json",
    },
  });
  if (result.ok) {
    return (await result.json()) as Member[];
  }
  return [];
};

const useMembersQuery = () => useQuery({ queryFn: queryMembers, queryKey: [] });

export default useMembersQuery;
