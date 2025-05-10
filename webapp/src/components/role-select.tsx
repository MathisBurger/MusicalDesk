import { UserRole } from "@/types/api/user";
import { Option, Select } from "@mui/joy";

interface RoleSelectProps {
  name: string;
  multiple?: boolean;
  defaultValue?: UserRole[];
}

const RoleSelect = ({ name, multiple, defaultValue }: RoleSelectProps) => {
  return (
    <Select name={name} multiple={multiple} defaultValue={defaultValue}>
      {Object.values(UserRole).map((role) => (
        <Option value={role} key={role}>
          {role}
        </Option>
      ))}
    </Select>
  );
};

export default RoleSelect;
