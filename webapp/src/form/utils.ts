import { FormEvent } from "react";
import {
  FormDefinition,
  FormType,
  FormValidationRules,
  FormValue,
} from "./types";

export const transformValue = (
  value: string | null,
  defaultValue: FormValue,
): FormValue => {
  if (typeof defaultValue === "number") {
    return isNaN(Number(value)) ? null : Number(value);
  }
  return value;
};

export const transformData = <T extends FormType>(
  data: FormEvent<FormDefinition>,
  defaultValues: Record<keyof T, FormValue>,
): T => {
  const transformed: Partial<T> = {};
  for (const key in Object.keys(data.currentTarget.elements)) {
    const element = data.currentTarget.elements[key];
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
