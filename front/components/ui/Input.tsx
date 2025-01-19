"use client";

import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import Text from "./Text";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className = "",
      startIcon,
      endIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputClasses = twMerge(
      "w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 transition-colors",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 duration-200",
      error ? "border-red-500" : "border-gray-300 hover:border-gray-400",
      disabled && "cursor-not-allowed bg-gray-50 opacity-50",
      (startIcon || endIcon) && "flex items-center gap-2",
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800">
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
            {...props}
          />
          {endIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800">
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

Input.displayName = "Input";

export default Input;
