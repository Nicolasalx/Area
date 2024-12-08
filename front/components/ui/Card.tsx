"use client";

import React, { ElementType, ReactNode, KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: ElementType;
  shadow?: "none" | "small" | "medium" | "large";
  border?: boolean;
  hover?: boolean | "translate" | "scale" | "shadow" | "all";
}

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

const Card = ({
  children,
  className = "",
  onClick,
  as: Component = "div",
  shadow = "none",
  border = true,
  hover = false,
}: CardProps) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (onClick && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick();
    }
  };

  const getShadowClasses = () => {
    switch (shadow) {
      case "none":
        return "";
      case "medium":
        return "shadow-md";
      case "large":
        return "shadow-lg";
      default:
        return "shadow-sm";
    }
  };

  const getHoverClasses = () => {
    if (!hover) return "";

    switch (hover) {
      case "translate":
        return "transition-transform duration-200 hover:-translate-y-1";
      case "scale":
        return "transition-transform duration-200 hover:scale-[1.02]";
      case "shadow":
        return "transition-shadow duration-200 hover:shadow-lg";
      case "all":
        return "transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg";
      case true:
        return "transition-shadow duration-200 hover:shadow-md";
      default:
        return "";
    }
  };

  const classes = twMerge(
    "rounded-lg bg-white overflow-hidden",
    getShadowClasses(),
    border && "border border-gray-200",
    getHoverClasses(),
    onClick &&
      "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 duration-200",
    className,
  );

  const cardProps = onClick
    ? {
        role: "button",
        tabIndex: 0,
        onClick,
        onKeyDown: handleKeyDown,
      }
    : {};

  return (
    <Component className={classes} {...cardProps}>
      {children}
    </Component>
  );
};

const CardHeader = ({ children, className = "" }: CardSectionProps) => {
  const classes = twMerge(
    "px-6 py-4 border-b border-gray-800 border-opacity-25",
    className,
  );
  return <div className={classes}>{children}</div>;
};

const CardBody = ({ children, className = "" }: CardSectionProps) => {
  const classes = twMerge("px-6 py-4", className);
  return <div className={classes}>{children}</div>;
};

const CardFooter = ({ children, className = "" }: CardSectionProps) => {
  const classes = twMerge(
    "px-6 py-4 border-t border-gray-800 border-opacity-25",
    className,
  );
  return <div className={classes}>{children}</div>;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
