import { TotalResponse } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const querySum = async (): Promise<TotalResponse | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/dashboard/yearly_earnings`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as TotalResponse | null;
  }
  return null;
};

const useDashboardExpectedMembershipFeesQuery = () =>
  useQuery({
    queryFn: () => querySum(),
    queryKey: ["dashboardExpenctedMembershipFees"],
  });

export default useDashboardExpectedMembershipFeesQuery;
