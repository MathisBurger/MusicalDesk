import { FormInputProps } from "./form-input";

export interface FormDefinition extends HTMLFormElement {
  readonly elements: HTMLFormControlsCollection;
}

export type FormValue = string | number | null;

export type FormType = Record<string, FormValue>;

export type FormValidationRules<T> = Record<
  keyof T,
  (v: FormValue) => string | null
>;

export type FormLabels<T> = Record<keyof T, string>;

export type SupportedInputProps = Pick<
  FormInputProps,
  "error" | "label" | "type" | "name" | "required"
>;
