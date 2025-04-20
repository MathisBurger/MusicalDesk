import { User, UserRole } from "@/hooks/useCurrentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateBackendUserRequest {
  username: string;
  password: string;
  roles: UserRole[];
}

const createUser = async (
  data: CreateBackendUserRequest,
): Promise<User | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/backend`,
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
  return (await result.json()) as User;
};

const useCreateBackendUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backendUsers"] });
    },
  });
};

export default useCreateBackendUserMutation;
