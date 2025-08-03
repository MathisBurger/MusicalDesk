import { InfoOutlined } from "@mui/icons-material";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
  Textarea,
} from "@mui/joy";
import { FormValue } from "./types";
import { ReactNode, useMemo } from "react";

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
    case "textarea":
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

  const formattedValue = useMemo(() => {
    if (value instanceof Date) {
      if (type === "date") {
        return `${value.getFullYear()}-${padNum(value.getMonth())}-${padNum(value.getDay())}`;
      } else {
        return `${value.getFullYear()}-${padNum(value.getMonth())}-${padNum(value.getDay())}T${padNum(value.getHours())}:${padNum(value.getMinutes())}`;
      }
    }
    if (typeof value === "number") {
      return value;
    }
    return `${value}`;
  }, [value, type]);

  const input = useMemo<ReactNode>(() => {
    switch (type) {
      case "textarea":
        return (
          <>
            <Textarea
              disabled={disabled}
              value={`${value}`}
              onChange={setValue ? (e) => setValue(e.target.value) : undefined}
              minRows={4}
            />
            <input type="hidden" name={name} value={`${value}`} />
          </>
        );
      case "boolean":
      case "checkbox":
        return (
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
        );
      default:
        return (
          <Input
            type={mapType(type)}
            name={name}
            endDecorator={endDecorator}
            disabled={disabled}
            slotProps={parseSlotProps(type, slotProps)}
            sx={sx}
            value={formattedValue}
            onChange={setValue ? (e) => setValue(e.target.value) : undefined}
          />
        );
    }
  }, [
    type,
    name,
    defaultValueOverride,
    endDecorator,
    disabled,
    slotProps,
    sx,
    value,
    setValue,
  ]);

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
      {input}
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
