import { Budget } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const queryBudget = async (id: number): Promise<Budget | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/budgets/${id}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Budget | null;
  }
  return null;
};

const useBudgetQuery = (id: number) =>
  useQuery({
    queryFn: () => queryBudget(id),
    queryKey: ["expenseBudgets", id],
  });

export default useBudgetQuery;
