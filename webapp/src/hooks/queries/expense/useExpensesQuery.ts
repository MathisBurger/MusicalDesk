import { Expense } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const expensesQuery = async (): Promise<Expense[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/expenses`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Expense[];
  }
  return [];
};

const useExpensesQuery = () =>
  useQuery({
    queryFn: () => expensesQuery(),
    queryKey: ["expenseExpenses"],
  });

export default useExpensesQuery;
