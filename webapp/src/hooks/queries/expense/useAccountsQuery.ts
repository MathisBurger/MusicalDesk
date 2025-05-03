import { useQuery } from "@tanstack/react-query";

export interface Account {
  id: number;
  name: string;
  owner_name: string;
  iban: string;
  is_tracking_account: boolean;
}

const accountsQuery = async (): Promise<Account[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/accounts`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Account[];
  }
  return [];
};

const useAccountsQuery = () =>
  useQuery({ queryFn: accountsQuery, queryKey: ["expenseAccounts"] });

export default useAccountsQuery;
