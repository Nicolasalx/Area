"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Text from "./Text";
import { ValidationRules, useFormValidation } from "./useFormValidation";

interface ValidatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  validation?: ValidationRules;
  onValidChange?: (isValid: boolean) => void;
}

const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  (
    {
      label,
      helperText,
      className = "",
      startIcon,
      endIcon,
      disabled,
      validation = {},
      onValidChange,
      onChange,
      onBlur,
      value = "",
      ...props
    },
    ref,
  ) => {
    const { validate, error, markAsDirty } = useFormValidation(validation);
    const [currentValue, setCurrentValue] = useState(value as string);

    useEffect(() => {
      const isValid = validate(currentValue);
      onValidChange?.(isValid);
    }, [currentValue, validate, onValidChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(e.target.value);
      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      markAsDirty();
      validate(e.target.value);
      onBlur?.(e);
    };

    const inputClasses = twMerge(
      "w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
      error ? "border-red-500" : "border-gray-300 hover:border-gray-400",
      disabled && "cursor-not-allowed bg-gray-50 opacity-50",
      className,
    );

    return (
      <div className="space-y-1">
        {label && (
          <Text as="label" variant="small" weight="medium">
            {label}
          </Text>
        )}
        <div className="relative">
          {startIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            style={{
              paddingLeft: startIcon ? "2.5rem" : "",
              paddingRight: endIcon ? "2.5rem" : "",
            }}
            value={currentValue}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
          />
          {endIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {endIcon}
            </span>
          )}
        </div>
        {(error || helperText) && (
          <Text variant="small" color={error ? "red" : "gray"}>
            {error || helperText}
          </Text>
        )}
      </div>
    );
  },
);

ValidatedInput.displayName = "ValidatedInput";

export default ValidatedInput;
