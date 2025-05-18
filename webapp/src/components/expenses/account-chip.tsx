import useCurrentUser from "@/hooks/useCurrentUser";
import { Account, MinimalAccount } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Chip, CssVarsProvider } from "@mui/joy";
import { useRouter } from "next/navigation";

interface AccountChipProps {
  account: Account | MinimalAccount;
}

const AccountChip = ({ account }: AccountChipProps) => {
  const router = useRouter();
  const currentUser = useCurrentUser();

  return (
    <CssVarsProvider>
      <Chip
        onClick={
          isGranted(currentUser, [UserRole.Accountant, UserRole.Admin])
            ? () => router.push(`/backend/expenses/accounts/${account.id}`)
            : undefined
        }
      >
        {account.name}
      </Chip>
    </CssVarsProvider>
  );
};

export default AccountChip;
