"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
}

const Button = ({
  className = "",
  children,
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled,
  onClick,
  href,
  target,
  ...props
}: ButtonProps) => {
  const baseStyles = `inline-flex lin items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-white transition-opacity duration-100 focus:opacity-75 hover:opacity-75 ${
    isLoading || disabled ? "cursor-not-allowed opacity-50" : ""
  } ${isLoading || leftIcon ? "pl-4" : ""} ${rightIcon ? "pr-4" : ""} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="animate-spin h-5" />
      ) : (
        leftIcon && <>{leftIcon}</>
      )}
      {children}
      {!isLoading && rightIcon && <>{rightIcon}</>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        className={baseStyles}
        onClick={(e) => {
          if (isLoading || disabled) {
            e.preventDefault();
            return;
          }
          onClick?.();
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={baseStyles}
      disabled={isLoading || disabled}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
