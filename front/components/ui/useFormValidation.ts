import { useState, useCallback } from "react";

export type ValidationRule = {
  validate: (value: string) => boolean;
  message: string;
};

export type ValidationRules = {
  required?: boolean | string;
  minLength?: [number, string?];
  maxLength?: [number, string?];
  pattern?: [RegExp, string?];
  custom?: ValidationRule[];
};

export const useFormValidation = (rules: ValidationRules = {}) => {
  const [error, setError] = useState<string>("");
  const [isDirty, setIsDirty] = useState(false);

  const validate = useCallback(
    (value: string): boolean => {
      if (!isDirty) {
        return true;
      }

      if (rules.required) {
        const isRequired =
          typeof rules.required === "boolean" ? rules.required : true;
        if (isRequired && !value.trim()) {
          setError(
            typeof rules.required === "string"
              ? rules.required
              : "This field is required",
          );
          return false;
        }
      }

      if (rules.minLength && value.length < rules.minLength[0]) {
        setError(
          rules.minLength[1] ||
            `Minimum length is ${rules.minLength[0]} characters`,
        );
        return false;
      }

      if (rules.maxLength && value.length > rules.maxLength[0]) {
        setError(
          rules.maxLength[1] ||
            `Maximum length is ${rules.maxLength[0]} characters`,
        );
        return false;
      }

      if (rules.pattern && !rules.pattern[0].test(value)) {
        setError(rules.pattern[1] || "Invalid format");
        return false;
      }

      if (rules.custom) {
        for (const rule of rules.custom) {
          if (!rule.validate(value)) {
            setError(rule.message);
            return false;
          }
        }
      }

      setError("");
      return true;
    },
    [rules, isDirty],
  );

  const markAsDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  return { validate, error, markAsDirty, isDirty };
};
