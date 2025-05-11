"use client";
import { FormInputProps } from "@/form/form-input";
import useCategoriesQuery from "@/hooks/queries/expense/useCategoriesQuery";
import { Autocomplete, FormControl, FormLabel } from "@mui/joy";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

const CategorySelect = ({
  name,
  label,
  required,
  error,
  disabled,
  sx,
}: FormInputProps) => {
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<null | {
    title: string;
    key: number;
  }>(null);
  const [debounced] = useDebounce(search, 1000);

  const { data, isLoading } = useCategoriesQuery(debounced);

  const options = useMemo(
    () =>
      (data ?? []).map((option) => ({ title: option.name, key: option.id })),
    [data],
  );

  console.log(options);

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

export default CategorySelect;
