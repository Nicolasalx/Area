"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileMenu = ({ isOpen, onClose, children }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div
        ref={menuRef}
        className="absolute right-0 top-0 h-full w-64 overflow-y-scroll bg-white shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="focus::outline-none rounded-full p-1 duration-200 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default MobileMenu;
