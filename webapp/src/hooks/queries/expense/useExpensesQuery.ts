import { Expense } from "@/types/api/expense";
import { Paginated } from "@/types/api/generic";
import { useQuery } from "@tanstack/react-query";

const expensesQuery = async (
  page: number,
  pageSize: number,
): Promise<Paginated<Expense>> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/expenses?page=${page}&page_size=${pageSize}`,
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

const useExpensesQuery = (page: number, pageSize: number) =>
  useQuery({
    queryFn: () => expensesQuery(page, pageSize),
    queryKey: ["expenseExpenses", page, pageSize],
  });

export default useExpensesQuery;
