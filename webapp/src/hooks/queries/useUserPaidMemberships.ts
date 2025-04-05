import { useQuery } from "@tanstack/react-query";

export interface MembershipPaid {
  year: number;
  member_id: number;
  paid_at: Date;
}

const membershipsQuery = async (
  member_id: number,
): Promise<MembershipPaid[] | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/memberships/members/${member_id}/paid`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as MembershipPaid[];
  }
  return null;
};

const useUserPaidMembershipsQuery = (year: number) =>
  useQuery({
    queryFn: () => membershipsQuery(year),
    queryKey: ["userPaidMemberships", year],
  });

export default useUserPaidMembershipsQuery;
