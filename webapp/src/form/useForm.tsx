import { FormEvent, useCallback, useState } from "react";
import {
  FormDefinition,
  FormLabels,
  FormType,
  FormValidationRules,
  SupportedInputProps,
} from "./types";
import { transformData, validateData } from "./utils";
import FormInput from "./form-input";

interface UseFormProps<T extends FormType> {
  defaultValues: T;
  validation?: FormValidationRules<T>;
  labels?: FormLabels<T>;
  required?: Array<keyof T>;
}

const useForm = <T extends FormType>({
  defaultValues,
  validation,
  labels,
  required,
}: UseFormProps<T>) => {
  const [errors, setErrors] = useState<Record<keyof T, string> | null>(null);

  const onSubmit = (handler: (values: T) => Promise<void>) => {
    return (e: FormEvent<FormDefinition>) => {
      e.preventDefault();
      const transformedData = transformData(e, defaultValues) as T;
      if (validation !== undefined) {
        const validationResults = validateData<T>(transformedData, validation);
        if (Object.keys(validationResults).length > 0) {
          setErrors(validationResults);
          return;
        }
      }
      handler(transformedData);
    };
  };

  const getInputProps = (key: keyof T): SupportedInputProps => {
    return {
      name: key as string,
      label: labels ? labels[key] : undefined,
      required: required ? required.indexOf(key) > -1 : undefined,
      type: typeof defaultValues[key],
      error: errors ? errors[key] : undefined,
    };
  };

  const renderFormBody = () => {
    return Object.keys(defaultValues).map((key) => (
      <FormInput {...getInputProps(key)} key={key} />
    ));
  };

  return { onSubmit, getInputProps, renderFormBody };
};

export default useForm;
