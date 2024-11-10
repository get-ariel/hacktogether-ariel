import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e56f5f",
          foreground: "#ffffff",
        },
        background: "#fffdf9",
        foreground: "#121827",
      },
    },
  },
  // ... rest of config
} satisfies Config;
