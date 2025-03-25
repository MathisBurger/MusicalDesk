import { FormEvent } from "react";
import {
  FormDefinition,
  FormType,
  FormValidationRules,
  FormValue,
} from "./types";

/**
 * Transforms the values into the desired format
 *
 * @param value The value that should be transformed
 * @param defaultValue The default value of the value
 * @returns The transformed value
 */
export const transformValue = (
  value: string | null,
  defaultValue: FormValue,
): FormValue => {
  if (typeof defaultValue === "number") {
    return isNaN(Number(value)) ? null : Number(value);
  }
  return value;
};

/**
 * Transforms the form event into the target data object
 *
 * @param event The form event
 * @param defaultValues The default values of the form inputs
 * @returns The transformed data object
 */
export const transformData = <T extends FormType>(
  event: FormEvent<FormDefinition>,
  defaultValues: Record<keyof T, FormValue>,
): T => {
  const transformed: Partial<T> = {};
  for (const key in Object.keys(event.currentTarget.elements)) {
    const element = event.currentTarget.elements[key];
    if (element !== undefined && element instanceof HTMLInputElement) {
      /** @ts-expect-error Ignore here */
      transformed[element.name] = transformValue(
        element.value,
        defaultValues[element.name],
      );
    }
  }
  return transformed as T;
};

/**
 * Validates the given data with specific rules
 *
 * @param data The data that should be validated
 * @param rules The rules used for validation
 * @returns The errors that occured during validation
 */
export const validateData = <T extends FormType>(
  data: T,
  rules: FormValidationRules<T>,
): Record<keyof T, string> => {
  const ruleMismatches: Partial<Record<keyof T, string>> = {};

  for (const rule of Object.entries(rules)) {
    const validationResult = rule[1](data[rule[0]]);
    if (validationResult !== null) {
      /** @ts-expect-error Ignore */
      ruleMismatches[rule[0]] = validationResult;
    }
  }
  return ruleMismatches as Record<keyof T, string>;
};
