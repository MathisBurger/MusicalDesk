import { Account } from "@/hooks/queries/expense/useAccountsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateCategoryRequest {
  name: string;
  hex_color: string;
  is_income: boolean;
}

const createCategory = async (
  data: CreateCategoryRequest,
): Promise<Account | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/categories`,
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

const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });
};

export default useCreateCategoryMutation;
