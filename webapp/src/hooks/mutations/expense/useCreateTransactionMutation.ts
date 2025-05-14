import { CreateTransactionRequest, Transaction } from "@/types/api/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createTransaction = async (
  data: CreateTransactionRequest,
): Promise<Transaction | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/transactions`,
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
  return (await result.json()) as Transaction;
};

const useCreateTransactionMutation = (pageSize: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenseTransactions", pageSize],
      });
    },
  });
};

export default useCreateTransactionMutation;
