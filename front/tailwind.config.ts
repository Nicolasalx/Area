import type { Config } from "tailwindcss";
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  safelist: [
    // Font sizes from variants
    "text-4xl",
    "text-3xl",
    "text-2xl",
    "text-xl",
    "text-lg",
    "text-base",
    "text-sm",
    "text-xs",

    // Font weights
    "font-light",
    "font-normal",
    "font-medium",
    "font-semibold",
    "font-bold",

    // Text alignments
    "text-left",
    "text-center",
    "text-right",
    "text-justify",

    // Text transforms
    "uppercase",
    "lowercase",
    "capitalize",

    // Line clamp
    {
      pattern: /line-clamp-[1-5]/,
    },

    // Ellipsis related
    "truncate",
    "whitespace-nowrap",
    "overflow-hidden",

    // Margins from variants
    "mb-4",
    "mb-3",
    "mb-2",

    // Tracking
    "tracking-tight",

    // Text decorations
    "italic",
    "underline",

    // Service gradients
    "from-gray-100",
    "from-indigo-100",
    "from-blue-100",
    "from-emerald-100",
    "from-orange-100",
    "from-white",
    "to-gray-100",
    "to-indigo-100",
    "to-blue-100",
    "to-emerald-100",
    "to-orange-100",
    "to-white",
    "text-gray-600",
    "text-indigo-500",
    "text-blue-500",
    "text-emerald-500",
    "text-orange-500",
    "text-white",

    "bg-gray-50",
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-300",
    "bg-gray-400",
    "bg-gray-500",
  ],
} satisfies Config;
