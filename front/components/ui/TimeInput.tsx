"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import Text from "./Text";
import { Clock } from "lucide-react";

interface TimeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
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
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isDirty, setIsDirty] = useState(false);
    const [currentValue, setCurrentValue] = useState(value || getCurrentTime());

    useEffect(() => {
      if (value) {
        setCurrentValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(e.target.value);
      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsDirty(true);
      onBlur?.(e);
    };

    const inputClasses = twMerge(
      "w-full rounded-lg border bg-white pl-10 pr-4 py-2.5 text-gray-900",
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
            type="time"
            className={inputClasses}
            disabled={disabled}
            value={currentValue}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Clock className="h-4 w-4" />
          </span>
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

TimeInput.displayName = "TimeInput";

export default TimeInput;
