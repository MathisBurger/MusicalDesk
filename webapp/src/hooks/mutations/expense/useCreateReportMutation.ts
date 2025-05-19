import { CreateReportRequest } from "@/types/api/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createReport = async (
  data: CreateReportRequest,
): Promise<Report | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/reports`,
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
  return (await result.json()) as Report;
};

const useCreateReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseReports"] });
    },
  });
};

export default useCreateReportMutation;
