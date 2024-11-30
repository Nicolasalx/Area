"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Form = ({ children, className = "", ...props }: FormProps) => {
  const formClasses = twMerge("space-y-6", className);

  return (
    <form className={formClasses} {...props}>
      {children}
    </form>
  );
};

export default Form;
