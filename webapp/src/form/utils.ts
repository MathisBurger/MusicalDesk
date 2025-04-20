import { FormEvent } from "react";
import {
  ExplicitTypeHints,
  FormDefinition,
  FormType,
  FormValidationRules,
  FormValue,
  Transformers,
  Types,
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
  defaultValue?: FormValue,
  typehint?: Types,
): FormValue => {
  if (value === null) {
    return null;
  }

  if (typehint) {
    if (typehint === "string") {
      return `${value}`;
    }
    if (typehint === "number") {
      return isNaN(Number(value)) ? null : Number(value);
    }
    if (typehint === "datetime-iso" && value !== "") {
      return new Date(`${value}`).toISOString();
    }
    if (typehint === "datetime-utc" && value !== "") {
      return new Date(`${value}`).toUTCString();
    }
    if (typehint === "array") {
      return JSON.parse(value);
    }
  }

  if ((defaultValue === null || defaultValue === undefined) && value === "") {
    return null;
  }
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
export const transformData = <T>(
  event: FormEvent<FormDefinition>,
  defaultValues?: Partial<FormType<T>>,
  typehints?: Partial<ExplicitTypeHints<FormType<T>>>,
): FormType<T> => {
  const transformed: Partial<T> = {};
  for (const key in Object.keys(event.currentTarget.elements)) {
    const element = event.currentTarget.elements[key];
    if (element !== undefined && element instanceof HTMLInputElement) {
      /** @ts-expect-error Ignore here */
      transformed[element.name] = transformValue(
        element.value,
        defaultValues ? defaultValues[element.name as keyof T] : undefined,
        typehints ? typehints[element.name as keyof T] : undefined,
      );
    }
  }
  return transformed as FormType<T>;
};

/**
 * Applies all transformers to the object
 *
 * @param data The data object
 * @param transformers All transformers that should be applied
 * @returns The transformed data object
 */
export const applyTransformers = <T>(
  data: T,
  transformers?: Transformers<T>,
): T => {
  if (transformers === undefined) {
    return data;
  }
  for (const key of Object.keys(transformers)) {
    // @ts-expect-error ignore
    data[key] = transformers[key](data[key]);
  }
  return data;
};

/**
 * Validates the given data with specific rules
 *
 * @param data The data that should be validated
 * @param rules The rules used for validation
 * @returns The errors that occured during validation
 */
export const validateData = <T>(
  data: FormType<T>,
  rules: FormValidationRules<FormType<T>>,
): Record<keyof T, string> => {
  const ruleMismatches: Partial<Record<keyof T, string>> = {};

  for (const rule of Object.entries(rules)) {
    /** @ts-expect-error Ignore */
    const validationResult = rule[1](data[rule[0]]);
    if (validationResult !== null) {
      /** @ts-expect-error Ignore */
      ruleMismatches[rule[0]] = validationResult;
    }
  }
  return ruleMismatches as Record<keyof T, string>;
};
