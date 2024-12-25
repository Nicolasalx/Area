"use client";

import { LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import DropdownItem from "@/components/ui/DropdownItem";
import Avatar from "@/components/ui/Avatar";
import MobileMenu from "@/components/ui/MobileMenu";
import Text from "@/components/ui/Text";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  const navigationLinks = [
    // { href: "/test", label: "Tests" },
    // { href: "/test/form", label: "Forms tests" },
    { href: "/workflows/new", label: i18n.t("newArea") },
    { href: "/workflows", label: i18n.t("myAreas") },
  ];

  return (
    <nav className="fixed z-30 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 flex-row items-center justify-between">
          {/* Logo */}
          <div className="h-full w-full">
            <div className="h-full w-fit flex-shrink-0">
              <Link
                href="/"
                className="flex h-full items-center rounded-md px-2 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <Text weight="bold" variant="h1" className="select-none">
                  AREA
                </Text>
              </Link>
            </div>
          </div>
          <div className="flex h-full w-full flex-row items-center justify-end gap-2">
            {/* Desktop Navigation */}
            <div className="hidden h-full md:flex md:items-center">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-md flex h-full items-center border-b-0 border-black p-4 text-gray-800 duration-200 hover:border-b-4 hover:bg-gray-200 hover:pb-3 hover:text-black focus-visible:rounded-md focus-visible:border-b-4 focus-visible:bg-gray-100 focus-visible:pb-3 focus-visible:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Language Select Dropdown */}
            <div className="flex items-center">
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="h-10 rounded-md border border-gray-300 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="jp">🇯🇵 日本語</option>
              </select>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-lg p-2 duration-200 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Profile Dropdown (Desktop) */}
            {user && (
              <div className="hidden md:flex md:items-center">
                <Dropdown
                  trigger={
                    <button className="flex h-full w-full items-center rounded-full hover:outline-none hover:ring-2 hover:ring-black hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
                      <Avatar src={user?.image} size="lg" />
                    </button>
                  }
                >
                  <div className="border-b border-gray-200 px-4 py-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <DropdownItem
                      href="/profile"
                      icon={<User className="h-4 w-4" />}
                    >
                      {i18n.t("navbar.profile")}
                    </DropdownItem>
                    <DropdownItem
                      href="/settings"
                      icon={<Settings className="h-4 w-4" />}
                    >
                      {i18n.t("navbar.settings")}
                    </DropdownItem>
                    <DropdownItem
                      icon={<LogOut className="h-4 w-4" />}
                      onClick={handleLogout}
                    >
                      {i18n.t("navbar.sign_out")}
                    </DropdownItem>
                  </div>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <div className="flex flex-col space-y-4">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-900 duration-200 hover:text-black focus:outline-none focus-visible:rounded-md focus-visible:text-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {i18n.t(link.label)}
            </Link>
          ))}
          {user && (
            <div className="h-full w-full border-t border-gray-200 pt-4">
              <div className="flex h-full w-full items-center gap-3 pb-4">
                <Avatar src={user?.image} size="lg" />
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm text-gray-700 duration-200 focus:outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  <User className="h-4 w-4" />
                  {i18n.t("navbar.profile")}
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 text-sm text-gray-700 duration-200 focus:outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  <Settings className="h-4 w-4" />
                  {i18n.t("navbar.settings")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-gray-700 duration-200 focus:outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  <LogOut className="h-4 w-4" />
                  {i18n.t("navbar.sign_out")}
                </button>
              </div>
            </div>
          )}
        </div>
      </MobileMenu>
    </nav>
  );
};

export default Navbar;
