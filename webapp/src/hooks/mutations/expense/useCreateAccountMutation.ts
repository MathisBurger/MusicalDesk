import { Account, CreateAccountRequest } from "@/types/api/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createAccount = async (
  data: CreateAccountRequest,
): Promise<Account | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/accounts`,
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
  return (await result.json()) as Account;
};

const useCreateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseAccounts"] });
    },
  });
};

export default useCreateAccountMutation;
