"use client";

import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import Text from "./Text";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", disabled, ...props }, ref) => {
    const textareaClasses = twMerge(
      "w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 duration-200",
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
        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          {...props}
        />
        {(error || helperText) && (
          <Text variant="small" color={error ? "red" : "gray"}>
            {error || helperText}
          </Text>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
