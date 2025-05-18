"use client";
import { FormInputProps } from "@/form/form-input";
import useAccountsQuery from "@/hooks/queries/expense/useAccountsQuery";
import { AccountType } from "@/types/api/expense";
import { Autocomplete, FormControl, FormLabel } from "@mui/joy";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

interface Props extends FormInputProps {
  accountType?: AccountType;
}

const AccountSelect = ({
  name,
  label,
  required,
  error,
  disabled,
  sx,
  accountType,
}: Props) => {
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<null | {
    title: string;
    key: number;
  }>(null);
  const [debounced] = useDebounce(search, 1000);

  const { data, isLoading } = useAccountsQuery(debounced, accountType);

  const options = useMemo(
    () =>
      (data ?? []).map((option) => ({
        title: `${option.name} (${option.owner_name})`,
        key: option.id,
      })),
    [data],
  );

  return (
    <FormControl
      required={required}
      error={error !== undefined}
      disabled={disabled}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <input
        name={name}
        value={selected?.key ?? -1}
        style={{ display: "none" }}
        required={required}
        readOnly
      />
      <Autocomplete
        loading={isLoading}
        getOptionLabel={(option) => option.title}
        options={options}
        inputValue={search}
        onInputChange={(_, newSearch) => setSearch(newSearch)}
        value={selected}
        onChange={(_, newValue) => setSelected(newValue)}
        sx={sx}
      />
    </FormControl>
  );
};

export default AccountSelect;
