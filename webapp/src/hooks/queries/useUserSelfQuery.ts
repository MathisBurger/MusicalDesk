import { useQuery } from "@tanstack/react-query";
import { User } from "../useCurrentUser";

const userQuery = async (): Promise<User | null> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/self`, {
    credentials: "include",
    mode: "cors",
    headers: {
      Accept: "application/json",
    },
  });
  if (result.ok) {
    return (await result.json()) as User;
  }
  return null;
};

const useUserSelfQuery = (execute: boolean) =>
  useQuery({ queryFn: userQuery, queryKey: [], enabled: execute });

export default useUserSelfQuery;
