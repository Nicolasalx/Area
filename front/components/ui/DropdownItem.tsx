"use client";

import Link from "next/link";

interface DropdownItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

const DropdownItem = ({ icon, children, onClick, href }: DropdownItemProps) => {
  return href ? (
    <Link
      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
      href={href}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      {children}
    </Link>
  ) : (
    <button
      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
      onClick={onClick}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      {children}
    </button>
  );
};

export default DropdownItem;
