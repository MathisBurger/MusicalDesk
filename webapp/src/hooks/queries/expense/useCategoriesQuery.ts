import { Category } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const categoriesQuery = async (
  search: string | undefined = undefined,
): Promise<Category[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/categories${search ? `?search=${search}` : ""}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Category[];
  }
  return [];
};

const useCategoriesQuery = (search: string | undefined = undefined) =>
  useQuery({
    queryFn: () => categoriesQuery(search),
    queryKey: ["expenseCategories", search],
  });

export default useCategoriesQuery;
