import { Expense } from "@/types/api/expense";
import { Paginated } from "@/types/api/generic";
import { useQuery } from "@tanstack/react-query";

const expensesQuery = async (
  id: number,
  page: number,
  page_size: number,
): Promise<Paginated<Expense>> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/budgets/${id}/expenses?page=${page}&page_size=${page_size}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Paginated<Expense>;
  }
  return { total: 0, results: [] };
};

const useBudgetExpensesQuery = (id: number, page: number, pageSize: number) =>
  useQuery({
    queryFn: () => expensesQuery(id, page, pageSize),
    queryKey: ["expenseBudgetExpenses", id, page, pageSize],
  });

export default useBudgetExpensesQuery;
