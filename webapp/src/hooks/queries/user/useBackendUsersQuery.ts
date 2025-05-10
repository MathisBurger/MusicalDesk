import { User } from "@/types/api/user";
import { useQuery } from "@tanstack/react-query";

const userQuery = async (): Promise<User[]> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/backend`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as User[];
  }
  return [];
};

const useBackendUsersQuery = () =>
  useQuery({ queryFn: userQuery, queryKey: ["backendUsers"] });

export default useBackendUsersQuery;
