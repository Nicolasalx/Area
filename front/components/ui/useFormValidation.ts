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
      let newError = "";
      let isValid = true;

      if (!rules.required && !value.trim()) {
        isValid = true;
      } else if (rules.required) {
        const isRequired =
          typeof rules.required === "boolean" ? rules.required : true;
        if (isRequired && !value.trim()) {
          newError =
            typeof rules.required === "string"
              ? rules.required
              : "This field is required";
          isValid = false;
        }
      }

      if (isValid && rules.minLength && value.length < rules.minLength[0]) {
        newError =
          rules.minLength[1] ||
          `Minimum length is ${rules.minLength[0]} characters`;
        isValid = false;
      }

      if (isValid && rules.maxLength && value.length > rules.maxLength[0]) {
        newError =
          rules.maxLength[1] ||
          `Maximum length is ${rules.maxLength[0]} characters`;
        isValid = false;
      }

      if (isValid && rules.pattern && !rules.pattern[0].test(value)) {
        newError = rules.pattern[1] || "Invalid format";
        isValid = false;
      }

      if (isValid && rules.custom) {
        for (const rule of rules.custom) {
          if (!rule.validate(value)) {
            newError = rule.message;
            isValid = false;
            break;
          }
        }
      }

      setError(newError);
      return isValid;
    },
    [rules],
  );

  const markAsDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  return { validate, error, markAsDirty, isDirty };
};
