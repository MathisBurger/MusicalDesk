import { AcceptExpenseRequest } from "@/types/api/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const acceptExpense = async (
  id: number,
  data: AcceptExpenseRequest,
): Promise<boolean> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/expenses/${id}/accept`,
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
  return result.ok;
};

const useAcceptExpenseMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcceptExpenseRequest) => acceptExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseExpenses", id] });
    },
  });
};

export default useAcceptExpenseMutation;
