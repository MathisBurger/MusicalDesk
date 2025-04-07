import { InfoOutlined } from "@mui/icons-material";
import {
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
  }
  return type ?? "text";
};

const padNum = (num: number): string => {
  if (num < 10) {
    return `0${num}`;
  }
  return `${num}`;
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

  console.log(defaultValueOverride);

  return (
    <FormControl
      required={required}
      error={error !== undefined}
      disabled={disabled}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        type={mapType(type)}
        name={name}
        defaultValue={defaultValueOverride ?? ""}
        endDecorator={endDecorator}
        disabled={disabled}
        sx={sx}
      />
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
