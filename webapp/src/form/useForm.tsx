import { FormEvent, useState } from "react";
import {
  FormDefinition,
  FormLabels,
  FormType,
  FormValidationRules,
  SupportedInputProps,
} from "./types";
import { transformData, validateData } from "./utils";
import FormInput from "./form-input";

/** Input props of the use form hook */
interface UseFormProps<T extends FormType> {
  /** All default values of a form */
  defaultValues: T;
  /** All validation rules that a form can have */
  validation?: FormValidationRules<T>;
  /** All labels of an form */
  labels?: FormLabels<T>;
  /** All required fields */
  required?: Array<keyof T>;
}

const useForm = <T extends FormType>({
  defaultValues,
  validation,
  labels,
  required,
}: UseFormProps<T>) => {
  const [errors, setErrors] = useState<Record<keyof T, string> | null>(null);

  /**
   * Event listener that can be passed to onSubmit of an HTML form element.
   *
   * @param handler The handler that handles the values after form submission
   * @returns The form submit event handler
   */
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

  /**
   * Gets the input props for a specific input
   * @param key The key (name) of the input
   * @returns The input props
   */
  const getInputProps = (key: keyof T): SupportedInputProps => {
    return {
      name: key as string,
      label: labels ? labels[key] : undefined,
      required: required ? required.indexOf(key) > -1 : undefined,
      type: typeof defaultValues[key],
      error: errors ? errors[key] : undefined,
    };
  };

  /** Renders the form body */
  const renderFormBody = () => {
    return Object.keys(defaultValues).map((key) => (
      <FormInput {...getInputProps(key)} key={key} />
    ));
  };

  return { onSubmit, getInputProps, renderFormBody };
};

export default useForm;
