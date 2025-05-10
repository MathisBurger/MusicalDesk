import { useQuery } from "@tanstack/react-query";
import { MinimalCategory } from "./useAccountTransactionsQuery";

export interface Budget {
  id: number;
  name: string;
  category: MinimalCategory;
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
}

const budgetsQuery = async (): Promise<Budget[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/budgets`,
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

const useBudgetsQuery = () =>
  useQuery({ queryFn: budgetsQuery, queryKey: ["expenseBudgets"] });

export default useBudgetsQuery;
