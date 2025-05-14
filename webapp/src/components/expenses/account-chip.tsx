import { Account, MinimalAccount } from "@/types/api/expense";
import { Chip, CssVarsProvider } from "@mui/joy";
import { useRouter } from "next/navigation";

interface AccountChipProps {
  account: Account | MinimalAccount;
}

const AccountChip = ({ account }: AccountChipProps) => {
  const router = useRouter();

  return (
    <CssVarsProvider>
      <Chip
        onClick={() => router.push(`/backend/expenses/accounts/${account.id}`)}
      >
        {account.name}
      </Chip>
    </CssVarsProvider>
  );
};

export default AccountChip;
