import { useMutation } from "@tanstack/react-query";

const loginFunction = async (credentials: {
  username: string;
  password: string;
}): Promise<boolean> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: JSON.stringify({ ...credentials }),
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
  });
  return result.ok;
};

const useLoginMutation = () => useMutation({ mutationFn: loginFunction });

export default useLoginMutation;
