import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require('daisyui'),],
  daisyui: {
    themes: [
      {
        mytheme: {        
          "primary": "#3B82F6",              
          "primary-content": "#ffffff",              
          "secondary": "#e5e7eb",              
          "secondary-content": "#121313",              
          "accent": "#1e3a8a",             
          "accent-content": "#ffffff",          
          "neutral": "#3b82f6",         
          "neutral-content": "#ffffff",         
          "base-100": "#ffffff",
          "base-200": "#dedede",
          "base-300": "#bebebe",
          "base-content": "#161616",
          "info": "#075985",
          "info-content": "#ffffff",
          "success": "#16a34a",
          "success-content": "#ffffff",
          "warning": "#fbbf24",
          "warning-content": "#150d00",
          "error": "#9f1239",
          "error-content": "#ffffff",
          },
        },
      ],
    darkTheme: "mytheme"
  },
};

export default config;
