import { TimePeriod, TotalResponse } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const totalTransactionsCreatedQuery = async (
  period: TimePeriod,
): Promise<TotalResponse | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/dashboard/total_transactions_created?period=${period}`,
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

const useDashboardTotalTransactionsCreatedQuery = (period: TimePeriod) =>
  useQuery({
    queryFn: () => totalTransactionsCreatedQuery(period),
    queryKey: ["expenseDashboardTotalTransactionsCreated", period],
  });

export default useDashboardTotalTransactionsCreatedQuery;
