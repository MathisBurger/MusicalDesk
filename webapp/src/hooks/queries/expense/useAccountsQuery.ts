import { Account } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const accountsQuery = async (
  search: string | undefined = undefined,
): Promise<Account[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/accounts${search ? `?search=${search}` : ""}`,
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

const useAccountsQuery = (search: string | undefined = undefined) =>
  useQuery({
    queryFn: () => accountsQuery(search),
    queryKey: ["expenseAccounts", search],
  });

export default useAccountsQuery;
