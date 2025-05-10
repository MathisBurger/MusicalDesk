import { Budget, UpdateBudgetRequest } from "@/types/api/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateBudget = async (
  id: number,
  data: UpdateBudgetRequest,
): Promise<Budget | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/budgets/${id}`,
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
  return (await result.json()) as Budget;
};

const useUpdateBudgetMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBudgetRequest) => updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseBudgets", id] });
    },
  });
};

export default useUpdateBudgetMutation;
