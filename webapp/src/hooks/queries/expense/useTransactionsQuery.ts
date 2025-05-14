import { Transaction } from "@/types/api/expense";
import { Paginated } from "@/types/api/generic";
import { useQuery } from "@tanstack/react-query";

const transactionsQuery = async (
  page: number,
  pageSize: number,
): Promise<Paginated<Transaction>> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/transactions?page=${page}&page_size=${pageSize}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Paginated<Transaction>;
  }
  return { total: 0, results: [] };
};

const useTransactionsQuery = (page: number, pageSize: number) =>
  useQuery({
    queryFn: () => transactionsQuery(page, pageSize),
    queryKey: ["expenseTransactions", page, pageSize],
  });

export default useTransactionsQuery;
