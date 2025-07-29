import { UserRole } from "@/types/api/user";
import { Option, Select } from "@mui/joy";
import { useTranslations } from "next-intl";

interface RoleSelectProps {
  name: string;
  multiple?: boolean;
  defaultValue?: UserRole[];
}

const RoleSelect = ({ name, multiple, defaultValue }: RoleSelectProps) => {
  const t = useTranslations();

  return (
    <Select name={name} multiple={multiple} defaultValue={defaultValue}>
      {Object.values(UserRole).map((role) => (
        <Option value={role} key={role}>
          {t(`roles.${role}`)}
        </Option>
      ))}
    </Select>
  );
};

export default RoleSelect;
