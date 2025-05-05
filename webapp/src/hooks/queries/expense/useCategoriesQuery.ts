import { useQuery } from "@tanstack/react-query";

export interface Category {
  id: number;
  name: string;
  hex_color: string;
  is_income: boolean;
}

const categoriesQuery = async (): Promise<Category[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/categories`,
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

const useCategoriesQuery = () =>
  useQuery({ queryFn: categoriesQuery, queryKey: ["expenseCategories"] });

export default useCategoriesQuery;
