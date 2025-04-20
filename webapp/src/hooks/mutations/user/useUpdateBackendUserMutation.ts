import { User, UserRole } from "@/hooks/useCurrentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateBackendUserRequest {
  roles: UserRole[];
}

const updateUser = async (
  data: UpdateBackendUserRequest,
  userId: number,
): Promise<User | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/backend/${userId}`,
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

const useUpdateBackendUserMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBackendUserRequest) => updateUser(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backendUser", id] });
    },
  });
};

export default useUpdateBackendUserMutation;
