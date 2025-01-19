import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

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
      keyframes: {
        "infinite-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-33.33333%))" },
        },
      },
      animation: {
        "infinite-scroll": "infinite-scroll 30s linear infinite",
      },
    },
  },
  plugins: [
    function ({ addVariant }: PluginAPI) {
      addVariant("hover-group", ".hover-group &");
      addVariant("hover-group-hover", ".hover-group:hover &");
    },
  ],
  safelist: [
    // Animation states
    "animate-none",
    "group-hover:animate-none",
    "pause",
    "running",
    "hover:pause",
    "[&:hover>*]:pause",
    "hover-group",
    "hover-group-hover:scale-110",
    "[animation-play-state:paused]",
    "[.hover-group:hover_&]:[animation-play-state:paused]",
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
    "from-indigo-50",
    "from-blue-50",
    "from-emerald-50",
    "from-orange-50",
    "from-cyan-50",
    "from-red-50",
    "from-green-50",
    "from-white",
    "to-gray-100",
    "to-indigo-50",
    "to-blue-50",
    "to-emerald-50",
    "to-orange-50",
    "to-cyan-50",
    "to-red-50",
    "to-green-50",
    "to-white",
    "text-gray-700",
    "text-indigo-500",
    "text-blue-500",
    "text-emerald-500",
    "text-orange-500",
    "text-cyan-500",
    "text-red-500",
    "text-green-500",
    "text-white",

    "bg-gray-50",
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-300",
    "bg-gray-400",
    "bg-gray-500",
  ],
} satisfies Config;
