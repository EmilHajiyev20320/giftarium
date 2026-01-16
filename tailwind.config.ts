import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Magical Gold Accents (from logo)
        primary: {
          50: "#FFF8E7",
          100: "#FFF0CC",
          200: "#FFE5A3",
          300: "#FFD97A",
          400: "#FFC876",
          500: "#FFB84C", // Magic gold
          600: "#FF995A", // Warm orange-gold
          700: "#E88A42",
          800: "#CC7A3A",
          900: "#B36A32",
          DEFAULT: "#FFB84C",
        },
        // Soft Cosmic Purples
        cosmic: {
          50: "#F5E8FF",
          100: "#E3C7FF", // Fairy purple
          200: "#C89BFF", // Lavender glow
          300: "#A86FFF",
          400: "#8B4DFF",
          500: "#6A2A9E",
          600: "#4A2367", // Warm berry purple
          700: "#3A1750", // Deep orchid
          800: "#2A113A", // Soft cosmic plum
          900: "#30103F",
          DEFAULT: "#3A1750",
        },
        // Background Purples
        background: {
          main: "#2A113A", // Soft cosmic plum
          card: "#3A1750", // Deep orchid
          secondary: "#4A2367", // Warm berry purple
          accent: "#30103F",
          DEFAULT: "#2A113A",
        },
        // Text Colors for Dark Theme
        neutral: {
          50: "#E3C7FF", // Light lavender for text on dark
          100: "#C89BFF",
          200: "#A86FFF",
          300: "#8B4DFF",
          400: "#6A2A9E",
          500: "#9E9E9E",
          600: "#BDBDBD",
          700: "#E0E0E0",
          800: "#F5F5F5",
          900: "#FFFFFF",
        },
        // Magical Accents
        magic: {
          gold: "#FFB84C",
          amber: "#FFC876",
          orange: "#FF995A",
          lavender: "#C89BFF",
          fairy: "#E3C7FF",
        },
        success: {
          50: "#D1FAE5",
          500: "#6EE7B7",
          700: "#065F46",
        },
        error: {
          50: "#FEE2E2",
          500: "#EF4444",
          700: "#991B1B",
        },
        warning: {
          50: "#FEF3C7",
          500: "#FCD34D",
          700: "#92400E",
        },
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "Playfair Display", "serif"],
        body: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        base: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
        base: "0 2px 8px rgba(42, 17, 58, 0.3), 0 0 20px rgba(200, 155, 255, 0.1)",
        md: "0 4px 12px rgba(42, 17, 58, 0.4), 0 0 30px rgba(200, 155, 255, 0.15)",
        lg: "0 10px 25px rgba(42, 17, 58, 0.5), 0 0 40px rgba(200, 155, 255, 0.2)",
        xl: "0 20px 40px rgba(42, 17, 58, 0.6), 0 0 60px rgba(200, 155, 255, 0.25)",
        soft: "0 4px 20px rgba(255, 184, 76, 0.25), 0 0 30px rgba(255, 184, 76, 0.1)",
        glow: "0 0 20px rgba(255, 184, 76, 0.4), 0 0 40px rgba(200, 155, 255, 0.2)",
        "glow-gold": "0 0 15px rgba(255, 184, 76, 0.5), 0 0 30px rgba(255, 184, 76, 0.3)",
        "glow-purple": "0 0 20px rgba(200, 155, 255, 0.4), 0 0 40px rgba(227, 199, 255, 0.2)",
      },
      backgroundImage: {
        "gradient-cosmic": "linear-gradient(135deg, #3A1750 0%, #2A113A 100%)",
        "gradient-berry": "linear-gradient(135deg, #4A2367 0%, #30103F 100%)",
        "gradient-magic": "linear-gradient(135deg, #FFB84C 0%, #FF995A 100%)",
        "gradient-gold": "linear-gradient(135deg, #FFC876 0%, #FFB84C 100%)",
        "gradient-purple-glow": "radial-gradient(ellipse at center, rgba(200, 155, 255, 0.15) 0%, transparent 70%)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
  plugins: [],
};
export default config;

