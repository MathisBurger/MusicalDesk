import { InfoOutlined } from "@mui/icons-material";
import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";
import { FormValue } from "./types";

/** Input props of an form input field */
export interface FormInputProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  type?: string;
  defaultValue?: FormValue;
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
    case "number":
      return "number";
  }
  return "text";
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
}: FormInputProps) => {
  return (
    <FormControl required={required} error={error !== undefined}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        type={mapType(type)}
        name={name}
        defaultValue={defaultValue ?? ""}
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
