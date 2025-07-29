import { FormInputProps } from "@/form/form-input";
import { AccountType } from "@/types/api/expense";
import { Option, Select } from "@mui/joy";
import { useTranslations } from "next-intl";

type AccountTypeSelectProps = Pick<
  FormInputProps,
  "defaultValue" | "name" | "value" | "setValue"
>;

const AccountTypeSelect = ({
  name,
  value,
  setValue,
}: AccountTypeSelectProps) => {
  const t = useTranslations();
  return (
    <Select
      name={name}
      value={value}
      onChange={
        setValue ? (_, newValue) => setValue(newValue as string) : undefined
      }
    >
      {Object.values(AccountType).map((role) => (
        <Option value={role} key={role}>
          {t(`labels.expense.account.types.${role}`)}
        </Option>
      ))}
    </Select>
  );
};

export default AccountTypeSelect;
