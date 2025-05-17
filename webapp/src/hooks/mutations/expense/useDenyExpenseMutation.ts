import { useMutation, useQueryClient } from "@tanstack/react-query";

const denyExpense = async (id: number): Promise<boolean> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/expenses/${id}/deny`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  return result.ok;
};

const useDenyExpenseMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => denyExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseExpenses", id] });
    },
  });
};

export default useDenyExpenseMutation;
