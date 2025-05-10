import { Budget, CreateBudgetRequest } from "@/types/api/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createBudget = async (
  data: CreateBudgetRequest,
): Promise<Budget | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/budgets`,
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

const useCreateBudgetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseBudgets"] });
    },
  });
};

export default useCreateBudgetMutation;
