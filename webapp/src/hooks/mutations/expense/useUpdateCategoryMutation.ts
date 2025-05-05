import { Category } from "@/hooks/queries/expense/useCategoriesQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateCategoryRequest {
  name: string;
  hex_color: string;
}

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
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });
};

export default useUpdateCategoryMutation;
