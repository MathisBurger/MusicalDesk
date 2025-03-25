import { useMutation } from "@tanstack/react-query";
import { Member } from "../queries/useMembersQuery";
import { FormType } from "@/form/types";

export interface CreateMemberRequest extends FormType {
  first_name: string;
  last_name: string;
  email: string | null;
  street: string | null;
  house_nr: string | null;
  zip: string | null;
  city: string | null;
  iban: string | null;
  membership_fee: number | null;
}

const createMember = async (
  data: CreateMemberRequest,
): Promise<Member | null> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!result.ok) {
    return null;
  }
  return (await result.json()) as Member;
};

const useCreateMemberMutation = () => useMutation({ mutationFn: createMember });

export default useCreateMemberMutation;
