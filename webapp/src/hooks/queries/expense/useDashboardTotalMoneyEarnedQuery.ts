import { TimePeriod, TotalResponse } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const earnedQuery = async (
  period: TimePeriod,
): Promise<TotalResponse | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/dashboard/total_money_earned?period=${period}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as TotalResponse;
  }
  return null;
};

const useDashboardTotalMoneyEarnedQuery = (period: TimePeriod) =>
  useQuery({
    queryFn: () => earnedQuery(period),
    queryKey: ["expenseDashboardTotalMoneyEarned", period],
  });

export default useDashboardTotalMoneyEarnedQuery;
