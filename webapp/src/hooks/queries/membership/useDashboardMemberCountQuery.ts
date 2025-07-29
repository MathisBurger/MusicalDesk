import { TotalResponse } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const queryCount = async (): Promise<TotalResponse | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/dashboard/member_count`,
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

const useDashboardMemberCountQuery = () =>
  useQuery({ queryFn: () => queryCount(), queryKey: ["dashboardMemberCount"] });

export default useDashboardMemberCountQuery;
