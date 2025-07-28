import { MoneyOverTimeByCategory, TimePeriod } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const moneySpentQuery = async (
  period: TimePeriod,
): Promise<MoneyOverTimeByCategory[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/dashboard/money_spent_over_time_by_category?period=${period}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as MoneyOverTimeByCategory[];
  }
  return [];
};

const useDashboardMoneySpentOverTimeByCategoryQuery = (period: TimePeriod) =>
  useQuery({
    queryFn: () => moneySpentQuery(period),
    queryKey: ["expenseDashboardMoneySpentOverTimeByCategory", period],
  });

export default useDashboardMoneySpentOverTimeByCategoryQuery;
