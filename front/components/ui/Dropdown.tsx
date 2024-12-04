"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

const Dropdown = ({ trigger, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
