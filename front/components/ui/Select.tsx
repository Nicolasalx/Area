"use client";

import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";
import Text from "./Text";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helperText, options, className = "", disabled, ...props },
    ref,
  ) => {
    const selectClasses = twMerge(
      "w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-gray-900 transition-colors",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 duration-200",
      error ? "border-red-500" : "border-gray-300 hover:border-gray-400",
      disabled && "cursor-not-allowed bg-gray-50 opacity-50",
      "bg-none",
      "-webkit-appearance-none -moz-appearance-none appearance-none",
      "relative z-20",
      className,
    );

    return (
      <div className="relative space-y-1">
        {label && (
          <Text as="label" variant="small" weight="medium">
            {label}
          </Text>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={selectClasses}
            disabled={disabled}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
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

Select.displayName = "Select";

export default Select;
