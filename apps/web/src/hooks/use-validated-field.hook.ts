import { useState, useEffect } from "react";
import { z } from "zod";

interface UseValidatedFieldOptions<T> {
  initialValue: T;
  validator?: (value: T) => string | null | undefined;
  schema?: z.ZodType<T>;
  syncWithAuth?: T | null;
  additionalValidation?: (value: T) => string | null | undefined;
}

export function useValidatedField<T>({
  initialValue,
  validator,
  schema,
  syncWithAuth,
  additionalValidation,
}: UseValidatedFieldOptions<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    if (syncWithAuth !== null && syncWithAuth !== undefined) {
      setValue(syncWithAuth);
    }
  }, [syncWithAuth]);

  const handleChange = (newValue: T) => {
    let error = "";

    if (schema) {
      const result = schema.safeParse(newValue);
      if (!result.success) {
        const firstError = result.error.issues[0];
        error = firstError.message;
      }
    } else if (validator) {
      const validatorError = validator(newValue);
      error = validatorError || "";
    }

    if (!error && additionalValidation) {
      const additionalError = additionalValidation(newValue);
      error = additionalError || "";
    }

    setValidationError(error);
    setValue(newValue);
  };

  const isValid = !validationError;
  const hasChanges = value !== (syncWithAuth ?? initialValue);

  return {
    value,
    setValue,
    validationError,
    handleChange,
    isValid,
    hasChanges,
  };
}
