import { TimePeriod, TotalResponse } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const spentQuery = async (
  period: TimePeriod,
): Promise<TotalResponse | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/dashboard/total_money_spent?period=${period}`,
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

const useDashboardTotalMoneySpentQuery = (period: TimePeriod) =>
  useQuery({
    queryFn: () => spentQuery(period),
    queryKey: ["expenseDashboardTotalMoneySpent", period],
  });

export default useDashboardTotalMoneySpentQuery;
