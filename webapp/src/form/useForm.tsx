import { FormEvent, useState } from "react";
import {
  ExplicitTypeHints,
  FormDefinition,
  FormLabels,
  FormType,
  FormValidationRules,
  FormValue,
  SupportedInputProps,
  Transformers,
} from "./types";
import { applyTransformers, transformData, validateData } from "./utils";
import FormInput from "./form-input";

/** Input props of the use form hook */
interface UseFormProps<T extends FormType> {
  /** All default values of a form */
  // TODO: Make default values not required
  defaultValues?: Record<keyof T, FormValue>;
  /** All validation rules that a form can have */
  validation?: FormValidationRules<T>;
  /** All labels of an form */
  labels?: FormLabels<T>;
  /** All required fields */
  required?: Array<keyof T>;
  /** All special transformer rules */
  transformers?: Transformers<T>;
  /** All typehints defined */
  explicitTypes?: ExplicitTypeHints<T>;
}

const useForm = <T extends FormType>({
  defaultValues,
  validation,
  labels,
  required,
  transformers,
  explicitTypes,
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
      const alignedData = transformData(e, defaultValues, explicitTypes) as T;
      const transformedData = applyTransformers(alignedData, transformers);
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

  const onInvalid = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-expect-error ignore
    setErrors({ [`${e.target.name}`]: "This value is required" });
  };

  const getFormType = (key: string) => {
    if (explicitTypes && explicitTypes[key]) {
      return explicitTypes[key];
    }
    if (defaultValues && defaultValues[key]) {
      return typeof defaultValues[key];
    }
    return "text";
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
      type: getFormType(key as string),
      error: errors ? errors[key] : undefined,
      defaultValue: defaultValues ? defaultValues[key] : undefined,
    };
  };

  /** Renders the form body
   * NOTE: Only those fields will be rendered which have a default value or an explicit type defined.
   */
  const renderFormBody = () => {
    const defaultValueKeys = defaultValues ? Object.keys(defaultValues) : [];
    const explicitTypesKeys = explicitTypes ? Object.keys(explicitTypes) : [];

    const keySet = new Set([...defaultValueKeys, ...explicitTypesKeys]);

    return Array.from(keySet).map((key) => (
      <FormInput {...getInputProps(key)} key={key} />
    ));
  };

  return { onSubmit, onInvalid, getInputProps, renderFormBody };
};

export default useForm;
