import { Transaction } from "@/types/api/expense";
import { Paginated } from "@/types/api/generic";
import { useQuery } from "@tanstack/react-query";

const transactionsQuery = async (
  id: number,
  page: number,
  page_size: number,
): Promise<Paginated<Transaction>> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/reports/${id}/transactions?page=${page}&page_size=${page_size}`,
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

const useReportTransactionsQuery = (
  id: number,
  page: number,
  pageSize: number,
) =>
  useQuery({
    queryFn: () => transactionsQuery(id, page, pageSize),
    queryKey: ["expenseReportTransactions", id, page, pageSize],
  });

export default useReportTransactionsQuery;
