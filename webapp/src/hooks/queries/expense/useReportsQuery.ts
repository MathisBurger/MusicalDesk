import { useQuery } from "@tanstack/react-query";

const reportsQuery = async (): Promise<Report[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/reports`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Report[];
  }
  return [];
};

const useReportsQuery = () =>
  useQuery({
    queryFn: reportsQuery,
    queryKey: ["expenseReports"],
  });

export default useReportsQuery;
