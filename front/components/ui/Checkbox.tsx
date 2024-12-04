"use client";

import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import Text from "./Text";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className = "", disabled, ...props }, ref) => {
    const checkboxClasses = twMerge(
      "h-4 w-4 rounded border-gray-300 text-black transition-colors",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 duration-200",
      error && "border-red-500",
      disabled && "cursor-not-allowed opacity-50",
      className,
    );

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            ref={ref}
            className={checkboxClasses}
            disabled={disabled}
            {...props}
          />
          {label && (
            <Text as="label" variant="small">
              {label}
            </Text>
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

Checkbox.displayName = "Checkbox";

export default Checkbox;
