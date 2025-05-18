import { Account, AccountType } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const accountsQuery = async (
  search: string | undefined,
  accountType: AccountType | undefined,
): Promise<Account[]> => {
  const searchParams = new URLSearchParams();
  if (search) {
    searchParams.set("search", search);
  }
  if (accountType) {
    searchParams.set("account_type", accountType);
  }

  const query = searchParams.size > 0 ? `?${searchParams.toString()}` : "";

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/accounts${query}`,
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

const useAccountsQuery = (
  search: string | undefined = undefined,
  accountType: AccountType | undefined = undefined,
) =>
  useQuery({
    queryFn: () => accountsQuery(search, accountType),
    queryKey: ["expenseAccounts", search, accountType],
  });

export default useAccountsQuery;
