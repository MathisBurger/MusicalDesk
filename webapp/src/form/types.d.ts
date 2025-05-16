import { FormInputProps } from "./form-input";

/** The general data definition of an form */
export interface FormDefinition extends HTMLFormElement {
  readonly elements: HTMLFormControlsCollection;
}

/** All possible value types a form entry can have */
export type FormValue =
  | string
  | number
  | null
  | undefined
  | Date
  | unknown[]
  | boolean;

/** The type a form data object must implement to be used and valid */
export type FormType<T> = Record<keyof T, FormValue>;

/** Definition of rules for form data validation */
export type FormValidationRules<T> = Partial<
  Record<keyof T, (v: FormValue) => string | null>
>;

/** Definition of possible form labels object */
export type FormLabels<T> = Record<keyof T, string>;

/** Definition of possible form transformers object */
export type Transformers<T> = Record<keyof T, (value: FormValue) => FormValue>;

export type ShowFieldConditions<T> = Partial<
  Record<keyof T, (row: Partial<Record<keyof T, FormValue>>) => boolean>
>;

type Types =
  | "string"
  | "number"
  | "datetime-iso"
  | "datetime-utc"
  | "password"
  | "boolean"
  | "array"
  | "color";

/** Definition of possible typehints for input fields. */
export type ExplicitTypeHints<T> = Partial<Record<keyof T, Types>>;

/** All input props of an form input that are supported by the useForm hook */
export type SupportedInputProps = Pick<
  FormInputProps,
  | "error"
  | "label"
  | "type"
  | "name"
  | "required"
  | "defaultValue"
  | "value"
  | "setValue"
  | "showField"
>;
