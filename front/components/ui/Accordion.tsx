"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Text from "./Text";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  className = "",
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={twMerge("rounded-lg border border-gray-200", className)}>
      <button
        className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Text variant="h5">{title}</Text>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 transform" : ""
          }`}
        />
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
}
