import { useQuery } from "@tanstack/react-query";
import { Account } from "./useAccountsQuery";

const queryAccount = async (id: number): Promise<Account | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/accounts/${id}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Account | null;
  }
  return null;
};

const useAccountQuery = (id: number) =>
  useQuery({
    queryFn: () => queryAccount(id),
    queryKey: ["expenseAccounts", id],
  });

export default useAccountQuery;
