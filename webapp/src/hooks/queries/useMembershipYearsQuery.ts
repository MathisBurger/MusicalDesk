import { useQuery } from "@tanstack/react-query";

const yearsQuery = async (): Promise<number[] | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/memberships/years`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as number[];
  }
  return null;
};

const useMembershipYearsQuery = () =>
  useQuery({ queryFn: yearsQuery, queryKey: ["yearsQuery"] });

export default useMembershipYearsQuery;
