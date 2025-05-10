import { UpdateBackendUserPasswordRequest, User } from "@/types/api/user";
import { useMutation } from "@tanstack/react-query";

const updateUser = async (
  data: UpdateBackendUserPasswordRequest,
  userId: number,
): Promise<User | null> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/backend/${userId}/password`,
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

const useUpdateBackendUserPasswordMutation = (id: number) => {
  return useMutation({
    mutationFn: (data: UpdateBackendUserPasswordRequest) =>
      updateUser(data, id),
  });
};

export default useUpdateBackendUserPasswordMutation;
