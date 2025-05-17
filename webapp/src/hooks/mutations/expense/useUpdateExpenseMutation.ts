import { Expense, ExpenseRequest } from "@/types/api/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateExpense = async (
  id: number,
  data: ExpenseRequest,
): Promise<Expense | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/expenses/${id}`,
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

const useUpdateExpenseMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExpenseRequest) => updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseExpenses", id] });
    },
  });
};

export default useUpdateExpenseMutation;
