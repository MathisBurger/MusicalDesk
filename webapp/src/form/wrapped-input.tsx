import { PropsWithChildren } from "react";
import { FormInputProps } from "./form-input";
import { FormControl, FormHelperText, FormLabel } from "@mui/joy";
import { InfoOutlined } from "@mui/icons-material";

const WrappedInput = ({
  required,
  error,
  disabled,
  label,
  children,
}: PropsWithChildren<FormInputProps>) => {
  return (
    <FormControl
      required={required}
      error={error !== undefined}
      disabled={disabled}
    >
      {label && <FormLabel>{label}</FormLabel>}
      {children}
      {error && (
        <FormHelperText>
          <InfoOutlined />
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default WrappedInput;
