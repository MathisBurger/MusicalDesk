import { ReportCategorySumup } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const sumupsQuery = async (id: number): Promise<ReportCategorySumup[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/reports/${id}/sumups`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as ReportCategorySumup[];
  }
  return [];
};

const useReportSumupsQuery = (id: number) =>
  useQuery({
    queryFn: () => sumupsQuery(id),
    queryKey: ["expenseReportSumups", id],
  });

export default useReportSumupsQuery;
