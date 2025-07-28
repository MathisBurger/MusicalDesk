import { Report } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const reportQuery = async (id: number): Promise<Report | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/reports/${id}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as Report;
  }
  return null;
};

const useReportQuery = (id: number) =>
  useQuery({
    queryFn: () => reportQuery(id),
    queryKey: ["expenseReports", id],
  });

export default useReportQuery;
