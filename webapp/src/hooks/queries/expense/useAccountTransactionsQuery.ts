import { useQuery } from "@tanstack/react-query";

export interface MinimalAccount {
  id: number;
  name: string;
}

export interface MinimalCategory {
  id: number;
  name: string;
  hex_color: string;
}

export interface Transaction {
  id: number;
  amount: number;
  from_account: MinimalAccount;
  to_account: MinimalAccount;
  timestamp: string | Date;
  category?: MinimalCategory;
  is_money_transaction: boolean;
}

export interface Paginated<T> {
  total: number;
  results: T[];
}

const transactionsQuery = async (
  id: number,
  page: number,
  page_size: number,
): Promise<Paginated<Transaction>> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/accounts/${id}/transactions?page=${page}&page_size=${page_size}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Paginated<Transaction>;
  }
  return { total: 0, results: [] };
};

const useAccountTransactionsQuery = (
  id: number,
  page: number,
  pageSize: number,
) =>
  useQuery({
    queryFn: () => transactionsQuery(id, page, pageSize),
    queryKey: ["expenseAccountTransactions", id, page, pageSize],
  });

export default useAccountTransactionsQuery;
