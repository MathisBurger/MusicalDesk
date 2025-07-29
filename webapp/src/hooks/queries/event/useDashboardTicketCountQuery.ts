import { TotalResponse } from "@/types/api/expense";
import { useQuery } from "@tanstack/react-query";

const ticketCount = async (): Promise<TotalResponse | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/dashboard/total_tickets`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as TotalResponse;
  }
  return null;
};

const useDashboardTicketCountQuery = () =>
  useQuery({ queryFn: ticketCount, queryKey: ["dashboardTicketCount"] });

export default useDashboardTicketCountQuery;
