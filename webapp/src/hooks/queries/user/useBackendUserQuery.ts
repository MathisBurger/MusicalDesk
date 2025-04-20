import { useQuery } from "@tanstack/react-query";
import { User } from "../../useCurrentUser";

const userQuery = async (id: number): Promise<User | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/backend/${id}`,
    {
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (result.ok) {
    return (await result.json()) as User;
  }
  return null;
};

const useBackendUserQuery = (id: number) =>
  useQuery({ queryFn: () => userQuery(id), queryKey: ["backendUser", id] });

export default useBackendUserQuery;
