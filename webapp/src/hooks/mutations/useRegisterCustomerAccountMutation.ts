import { useMutation } from "@tanstack/react-query";

export interface RegisterRequest {
  email: string;
  password: string;
}

const registerFunction = async (creds: RegisterRequest): Promise<boolean> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register_customer`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(creds),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  return result.ok;
};

const useRegisterCustomerAccountMutation = () =>
  useMutation({ mutationFn: registerFunction });

export default useRegisterCustomerAccountMutation;
