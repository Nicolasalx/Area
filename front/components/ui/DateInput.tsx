"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import Text from "./Text";
import { format } from "date-fns";

interface DateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  > {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (date: string) => void;
}

const getCurrentDate = () => {
  return format(new Date(), "yyyy-MM-dd");
};

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      helperText,
      error,
      className = "",
      disabled,
      required,
      value = "",
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isDirty, setIsDirty] = useState(false);
    const [currentValue, setCurrentValue] = useState(value || getCurrentDate());

    useEffect(() => {
      if (value) {
        setCurrentValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setCurrentValue(newValue);
      setIsDirty(true);
      onChange?.(newValue);
    };

    const inputClasses = twMerge(
      "w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 duration-200",
      isDirty && error
        ? "border-red-500"
        : "border-gray-300 hover:border-gray-400",
      disabled && "cursor-not-allowed bg-gray-50 opacity-50",
      className,
    );

    return (
      <div className="space-y-1">
        {label && (
          <Text as="label" variant="small" weight="medium">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Text>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="date"
            className={inputClasses}
            disabled={disabled}
            value={currentValue}
            onChange={handleChange}
            {...props}
          />
        </div>
        {isDirty && (error || helperText) && (
          <Text variant="small" color={error ? "red" : "gray"}>
            {error || helperText}
          </Text>
        )}
      </div>
    );
  },
);

DateInput.displayName = "DateInput";

export default DateInput;
