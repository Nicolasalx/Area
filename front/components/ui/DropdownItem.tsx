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
      className="focus-visible::outline-none flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 duration-200 hover:rounded-md hover:bg-gray-100 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      href={href}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      {children}
    </Link>
  ) : (
    <button
      className="focus-visible::outline-none flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 duration-200 hover:rounded-md hover:bg-gray-100 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      onClick={onClick}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      {children}
    </button>
  );
};

export default DropdownItem;
