import { TotalResponse } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const balanceQuery = async (): Promise<TotalResponse | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/dashboard/money_balance`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as TotalResponse;
  }
  return null;
};

const useDashboardMoneyBalanceQuery = () =>
  useQuery({
    queryFn: () => balanceQuery(),
    queryKey: ["expenseDashboardMoneyBalance"],
  });

export default useDashboardMoneyBalanceQuery;
