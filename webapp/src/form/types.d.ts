import { FormInputProps } from "./form-input";

/** The general data definition of an form */
export interface FormDefinition extends HTMLFormElement {
  readonly elements: HTMLFormControlsCollection;
}

/** All possible value types a form entry can have */
export type FormValue = string | number | null;

/** The type a form data object must implement to be used and valid */
export type FormType = Record<string, FormValue>;

/** Definition of rules for form data validation */
export type FormValidationRules<T> = Record<
  keyof T,
  (v: FormValue) => string | null
>;

/** Definition of possible form labels object */
export type FormLabels<T> = Record<keyof T, string>;

/** All input props of an form input that are supported by the useForm hook */
export type SupportedInputProps = Pick<
  FormInputProps,
  "error" | "label" | "type" | "name" | "required"
>;
