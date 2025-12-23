import { useState, useEffect } from "react";

interface UseValidatedFieldOptions<T> {
  initialValue: T;
  validator?: (value: T) => string | null | undefined;
  syncWithAuth?: T | null;
}

export function useValidatedField<T>({
  initialValue,
  validator,
  syncWithAuth,
}: UseValidatedFieldOptions<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    if (syncWithAuth !== null && syncWithAuth !== undefined) {
      setValue(syncWithAuth);
    }
  }, [syncWithAuth]);

  const handleChange = (newValue: T) => {
    if (validator) {
      const error = validator(newValue);
      setValidationError(error || "");
    }
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
