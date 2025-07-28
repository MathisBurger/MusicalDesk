import { MoneyOverTime, TimePeriod } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const moneySpentQuery = async (
  period: TimePeriod,
): Promise<MoneyOverTime[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/dashboard/money_spent_over_time?period=${period}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as MoneyOverTime[];
  }
  return [];
};

const useDashboardMoneySpentOverTimeQuery = (period: TimePeriod) =>
  useQuery({
    queryFn: () => moneySpentQuery(period),
    queryKey: ["expenseDashboardMoneySpentOverTime", period],
  });

export default useDashboardMoneySpentOverTimeQuery;
