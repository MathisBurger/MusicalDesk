import { Transaction } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const transactionQuery = async (id: number): Promise<Transaction | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/transactions/${id}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Transaction | null;
  }
  return null;
};

const useTransactionQuery = (id: number) =>
  useQuery({
    queryFn: () => transactionQuery(id),
    queryKey: ["expenseTransactions", id],
  });

export default useTransactionQuery;
