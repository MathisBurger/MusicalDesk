import { Category, CreateCategoryRequest } from "@/types/api/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createCategory = async (
  data: CreateCategoryRequest,
): Promise<Category | null> => {
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
  return (await result.json()) as Category;
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
