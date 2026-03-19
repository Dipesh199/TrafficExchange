import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#3b82f6",     // Blue 500
                secondary: "#8b5cf6",   // Violet 500
                accent: "#10b981",      // Emerald 500
                darkBg: "#0f172a",      // Slate 900
                darkSurface: "#1e293b", // Slate 800
            },
        },
    },
    plugins: [
        require('daisyui'),
        require('tailwind-scrollbar')({ nocompatible: true }),
        require('@tailwindcss/typography'),
    ],
    daisyui: {
        themes: ["light", "dark", "dracula"], // Configured modern themes
    },
};

export default config;
