import { InfoOutlined } from "@mui/icons-material";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
} from "@mui/joy";
import { FormValue } from "./types";
import { useMemo } from "react";

/** Input props of an form input field */
export interface FormInputProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  type?: string;
  defaultValue?: FormValue;
  endDecorator?: InputProps["endDecorator"];
  disabled?: boolean;
  sx?: InputProps["sx"];
  slotProps?: InputProps["slotProps"];
  value?: FormValue;
  setValue?: (value: FormValue) => void;
  showField?: boolean;
}

/**
 * Maps the data type to an html input type
 * @param type The data type
 * @returns The html input type
 */
const mapType = (type?: string): string => {
  switch (type) {
    case "string":
      return "text";
    case "datetime":
    case "datetime-iso":
    case "datetime-utc":
      return "datetime-local";
    case "boolean":
      return "checkbox";
  }
  return type ?? "text";
};

const padNum = (num: number): string => {
  if (num < 10) {
    return `0${num}`;
  }
  return `${num}`;
};

const parseSlotProps = (
  type?: string,
  slotProps?: InputProps["slotProps"],
): InputProps["slotProps"] => {
  if (type === "number") {
    if (slotProps) {
      return { ...slotProps, input: { ...slotProps.input, step: 0.01 } };
    }
    return { input: { step: 0.01 } };
  }
  return slotProps;
};

/**
 * The form input component that renders MUI form control with input and error
 */
const FormInput = ({
  name,
  label,
  required,
  error,
  type,
  defaultValue,
  endDecorator,
  disabled,
  sx,
  slotProps,
  value,
  setValue,
  showField = true,
}: FormInputProps) => {
  const defaultValueOverride = useMemo<Exclude<FormValue, Date>>(() => {
    if (defaultValue instanceof Date) {
      if (type === "date") {
        return `${defaultValue.getFullYear()}-${padNum(defaultValue.getMonth())}-${padNum(defaultValue.getDay())}`;
      } else if (type === "datetime") {
        return `${defaultValue.getFullYear()}-${padNum(defaultValue.getMonth())}-${padNum(defaultValue.getDay())}T${padNum(defaultValue.getHours())}:${padNum(defaultValue.getMinutes())}`;
      }
      return "no valid date format";
    }
    return defaultValue;
  }, [defaultValue, type]);

  if (!showField) {
    return null;
  }

  return (
    <FormControl
      required={required}
      error={error !== undefined}
      disabled={disabled}
    >
      {label && <FormLabel>{label}</FormLabel>}
      {mapType(type) === "checkbox" ? (
        <Checkbox
          defaultChecked={
            (defaultValueOverride as boolean | null | undefined) ?? false
          }
          name={name}
          disabled={disabled}
          sx={sx}
          checked={value === true}
          onChange={setValue ? (e) => setValue(e.target.checked) : undefined}
        />
      ) : (
        <Input
          type={mapType(type)}
          name={name}
          defaultValue={(defaultValueOverride as string) ?? ""}
          endDecorator={endDecorator}
          disabled={disabled}
          slotProps={parseSlotProps(type, slotProps)}
          sx={sx}
          value={typeof value === "number" ? value : `${value}`}
          onChange={setValue ? (e) => setValue(e.target.value) : undefined}
        />
      )}
      {error && (
        <FormHelperText>
          <InfoOutlined />
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default FormInput;
