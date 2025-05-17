import { ExpenseWithImages } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const queryExpense = async (id: number): Promise<ExpenseWithImages | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/expenses/${id}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as ExpenseWithImages | null;
  }
  return null;
};

const useExpenseQuery = (id: number) =>
  useQuery({
    queryFn: () => queryExpense(id),
    queryKey: ["expenseExpenses", id],
  });

export default useExpenseQuery;
