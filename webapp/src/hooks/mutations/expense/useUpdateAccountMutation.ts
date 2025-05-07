import { Account } from "@/hooks/queries/expense/useAccountsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateAccountRequest {
  name: string;
  owner_name: string;
  iban: string;
}

const updateAccount = async (
  id: number,
  data: UpdateAccountRequest,
): Promise<Account | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/accounts/${id}`,
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

const useUpdateAccountMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAccountRequest) => updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseAccounts", id] });
    },
  });
};

export default useUpdateAccountMutation;
