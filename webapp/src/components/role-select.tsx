import { UserRole } from "@/hooks/useCurrentUser";
import { Chip, Option, Select, SelectOption, Stack } from "@mui/joy";
import { ReactNode } from "react";

interface RoleSelectProps {
  name: string;
  multiple?: boolean;
  defaultValue?: UserRole[];
}

const RoleSelect = ({ name, multiple, defaultValue }: RoleSelectProps) => {
  return (
    <Select
      name={name}
      multiple={multiple}
      defaultValue={defaultValue}
      renderValue={(options: SelectOption<string>[]): ReactNode => (
        <Stack spacing={1} direction="row">
          {options.map((role) => (
            <Chip color="primary" variant="soft" key={role.value}>
              {role.label}
            </Chip>
          ))}
        </Stack>
      )}
    >
      {Object.values(UserRole).map((role) => (
        <Option value={role} key={role}>
          {role}
        </Option>
      ))}
    </Select>
  );
};

export default RoleSelect;
