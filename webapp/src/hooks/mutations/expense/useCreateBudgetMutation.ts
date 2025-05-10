import { Budget } from "@/hooks/queries/expense/useBudgetsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateBudgetRequest {
  name: string;
  category_id: number;
  start_date: string;
  end_date: string;
  budget: number;
}

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
