"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Transaction } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { CssVarsProvider } from "@mui/joy";
import { Chip } from "@mui/joy";
import { useRouter } from "next/navigation";

interface TransactionChipProps {
  value: Transaction;
}

const TransactionChip = ({ value }: TransactionChipProps) => {
  const router = useRouter();
  const currentUser = useCurrentUser();

  return (
    <CssVarsProvider>
      <Chip
        onClick={
          isGranted(currentUser, [UserRole.Accountant, UserRole.Admin])
            ? () => router.push(`/backend/expenses/transactions/${value.id}`)
            : undefined
        }
      >
        {value.name}
      </Chip>
    </CssVarsProvider>
  );
};

export default TransactionChip;
