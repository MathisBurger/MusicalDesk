import { useMutation } from "@tanstack/react-query";

const uploadFiles = async (id: number, data: FormData): Promise<boolean> => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expense/expenses/${id}/images`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: data,
      headers: {
        Accept: "application/json",
      },
    },
  );
  return result.ok;
};

const useUploadFileToExpenseMutation = (id: number) =>
  useMutation({ mutationFn: (data: FormData) => uploadFiles(id, data) });

export default useUploadFileToExpenseMutation;
