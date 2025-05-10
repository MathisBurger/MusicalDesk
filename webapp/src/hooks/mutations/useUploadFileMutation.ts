import { Image } from "@/types/api/generic";
import { useMutation } from "@tanstack/react-query";

const uploadFile = async (data: FormData): Promise<Image | null> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: data,
    headers: {
      Accept: "application/json",
    },
  });
  if (!result.ok) {
    return null;
  }
  return (await result.json()) as Image;
};

const useUploadFileMutation = () => useMutation({ mutationFn: uploadFile });

export default useUploadFileMutation;
