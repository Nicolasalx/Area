"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface DropdownItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  textColor?: string;
  hover?: string;
}

const DropdownItem = ({ icon, children, onClick, href, className, textColor, hover }: DropdownItemProps) => {
  return href ? (
    <Link
      className={twMerge(
        "focus-visible::outline-none flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 duration-200 hover:rounded-md hover:bg-gray-100 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        hover,
        className,
      )}
      href={href}
    >
      {icon && (
        <span className={textColor ? "text-gray-500" : textColor}>{icon}</span>
      )}
      {children}
    </Link>
  ) : (
    <button
      className={twMerge(
        "focus-visible::outline-none flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 duration-200 hover:rounded-md hover:bg-gray-100 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        hover,
        className,
      )}
      onClick={onClick}
    >
      {icon && (
        <span className={textColor ? "text-gray-500" : textColor}>{icon}</span>
      )}
      {children}
    </button>
  );
};

export default DropdownItem;
