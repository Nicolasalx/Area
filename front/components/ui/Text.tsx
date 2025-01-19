"use client";

import React, { ElementType, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "small"
  | "caption";
type Color = string;
type Weight = "light" | "normal" | "medium" | "semibold" | "bold";
type Align = "left" | "center" | "right" | "justify";
type Transform = "uppercase" | "lowercase" | "capitalize";
type LineClamp = 1 | 2 | 3 | 4 | 5;

interface TextProps {
  children: ReactNode;
  variant?: Variant;
  color?: Color;
  weight?: Weight;
  align?: Align;
  transform?: Transform;
  lineClamp?: LineClamp;
  italic?: boolean;
  underline?: boolean;
  truncate?: boolean;
  className?: string;
  as?: ElementType;
}

const Text = ({
  children,
  variant = "body",
  color = "black",
  weight,
  align,
  transform,
  lineClamp,
  italic = false,
  underline = false,
  truncate = false,
  className = "",
  as: CustomComponent,
}: TextProps) => {
  const getVariantStyles = (variant: Variant) => {
    switch (variant) {
      case "h1":
        return "text-4xl tracking-tight";
      case "h2":
        return "text-3xl tracking-tight";
      case "h3":
        return "text-2xl";
      case "h4":
        return "text-xl";
      case "h5":
        return "text-lg";
      case "h6":
        return "text-base";
      case "body":
        return "text-base";
      case "small":
        return "text-sm";
      case "caption":
        return "text-xs opacity-75";
    }
  };

  const getDefaultWeight = (variant: Variant) => {
    switch (variant) {
      case "h1":
      case "h2":
        return "bold";
      case "h3":
      case "h4":
        return "semibold";
      default:
        return "normal";
    }
  };

  const getElement = (variant: Variant): ElementType => {
    switch (variant) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return variant;
      case "body":
        return "p";
      default:
        return "span";
    }
  };

  const Component = CustomComponent || getElement(variant);

  const classes = twMerge(
    getVariantStyles(variant),
    color && (color === "white" || color === "black")
      ? `text-${color.toLocaleLowerCase()}`
      : `text-${color.toLocaleLowerCase()}-500`,
    weight ? `font-${weight}` : `font-${getDefaultWeight(variant)}`,
    align && `text-${align}`,
    transform && transform,
    lineClamp ? `line-clamp-${lineClamp}` : truncate && "truncate",
    italic && "italic",
    underline && "underline",
    className,
  );

  return <Component className={classes}>{children}</Component>;
};

export default Text;
