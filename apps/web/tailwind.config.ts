import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2b2d31",
        secondary: "#313338",
        animation: '#4c4f54',
        midnightGreen: {
          100: '#509A97',
          200: '#2C8582',
          300: '#167975',
          400: '#006C67',
          500: '#005F5F',
          600: '#005256',
          700: '#004950',
          800: '#003F49',
          900: '#003844'
        }
      },
      fontFamily: {
        tttrailers: ["TT Trailers Trial", "sans-serif"],
        gintonord: ['ABC Ginto Nord Unlicensed Trial', 'sans-serif'],
        'funnel-display': ["Funnel Display", "sans-serif"]
      }
    },
  },
  plugins: [],
} satisfies Config;
