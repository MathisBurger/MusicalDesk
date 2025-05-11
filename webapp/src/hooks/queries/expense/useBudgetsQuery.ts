import { Budget } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const budgetsQuery = async (active: boolean): Promise<Budget[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/budgets?active=${active}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Budget[];
  }
  return [];
};

const useBudgetsQuery = (active: boolean) =>
  useQuery({
    queryFn: () => budgetsQuery(active),
    queryKey: ["expenseBudgets", active],
  });

export default useBudgetsQuery;
