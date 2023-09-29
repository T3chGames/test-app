import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { 
    container: {
      screens: {
        sm: '2000px',
        md: '2000px',
        lg: '2000px',
        xl: '2000px',
        '2xl': '2000px',
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        text: "#FFFFFF",
        darkslate: "#2E323C",
        ultraviolet: "#4F517D",
        tropicalindigo: "#A997DF",
        borders: "#2A2831",
        background: "#333241",
        modalbackground: "#2F343F",
        tableborders: "#4F517D",
        "collection-1-background": "var(--collection-1-background)",
        "collection-1-borders": "var(--collection-1-borders)",
        "collection-1-dark-slate-gray": "var(--collection-1-dark-slate-gray)",
        "collection-1-different-thistle":
          "var(--collection-1-different-thistle)",
        "collection-1-icons": "var(--collection-1-icons)",
        "collection-1-remove-button": "var(--collection-1-remove-button)",
        "collection-1-text": "var(--collection-1-text)",
        "collection-1-thistle": "var(--collection-1-thistle)",
        "collection-1-tropical-indigo": "var(--collection-1-tropical-indigo)",
        "collection-1-ultra-violet": "var(--collection-1-ultra-violet)",
      },
    },
  },

  plugins: [],
};
export default config;
