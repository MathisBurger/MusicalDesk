import { Member } from "@/types/api/membership";
import { useQuery } from "@tanstack/react-query";

const membershipsQuery = async (year: number): Promise<Member[] | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/memberships/years/${year}/paid`,
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
  return null;
};

const usePaidMembershipsQuery = (year: number, execute: boolean) =>
  useQuery({
    queryFn: () => membershipsQuery(year),
    queryKey: ["paidMemberships", year],
    enabled: execute,
  });

export default usePaidMembershipsQuery;
