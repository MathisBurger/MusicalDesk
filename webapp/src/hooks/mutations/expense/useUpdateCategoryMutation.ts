import { Category } from "@/hooks/queries/expense/useCategoriesQuery";
import { UpdateCategoryRequest } from "@/types/api/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateCategory = async (
  id: number,
  data: UpdateCategoryRequest,
): Promise<Category | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/categories/${id}`,
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

const useUpdateCategoryMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseCategories", id] });
    },
  });
};

export default useUpdateCategoryMutation;
