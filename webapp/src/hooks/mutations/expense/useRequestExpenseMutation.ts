import { Expense, ExpenseRequest } from "@/types/api/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const requestExpense = async (
  data: ExpenseRequest,
): Promise<Expense | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/expenses`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  if (!result.ok) {
    return null;
  }
  return (await result.json()) as Expense;
};

const useRequestExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseExpenses"] });
    },
  });
};

export default useRequestExpenseMutation;
