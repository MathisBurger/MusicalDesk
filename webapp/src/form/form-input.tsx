import { InfoOutlined } from "@mui/icons-material";
import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";

export interface FormInputProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  type?: string;
}

const mapType = (type?: string): string => {
  switch (type) {
    case "string":
      return "text";
    case "number":
      return "number";
  }
  return "text";
};

const FormInput = ({ name, label, required, error, type }: FormInputProps) => {
  return (
    <FormControl required={required} error={error !== undefined}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input type={mapType(type)} name={name} />
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
