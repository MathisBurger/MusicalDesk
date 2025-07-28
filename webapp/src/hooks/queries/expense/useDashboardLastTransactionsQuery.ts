import { ScatterTransaction } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const transactionsQuery = async (): Promise<ScatterTransaction[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/dashboard/last_transactions`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as ScatterTransaction[];
  }
  return [];
};

const useDashboardLastTransactionsQuery = () =>
  useQuery({
    queryFn: () => transactionsQuery(),
    queryKey: ["expenseDashboardLastTransactions"],
  });

export default useDashboardLastTransactionsQuery;
