import { Category } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const queryCategory = async (id: number): Promise<Category | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/categories/${id}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Category | null;
  }
  return null;
};

const useCategoryQuery = (id: number) =>
  useQuery({
    queryFn: () => queryCategory(id),
    queryKey: ["expenseCategories", id],
  });

export default useCategoryQuery;
