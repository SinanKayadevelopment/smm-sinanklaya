import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      colors: {
        theme: {
          purple: "#7C1CF5", // Botcubey Canlı Mor
          purpleDark: "#6005BA", // Koyu Mor
          purpleLight: "#9D4EDD", // Açık Mor
          lavender: "#F3E8FF", // Lavanta Fiyat Etiketi Zemini
          borderLight: "#EDE9FE", // Kart Kenarlığı
          darkText: "#1E1B4B", // Başlık & Metin Rengi
          grayText: "#4B5563",
          bgLight: "#FFFFFF",
          surface: "#FFFFFF",
          border: "#EDE9FE",
        },
        botcubey: {
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
          700: "#7C1CF5",
          800: "#6005BA",
          900: "#49028F",
        },
        twitch: "#9146FF",
        kick: "#53FC18",
      },
      boxShadow: {
        botcubeyCard: "0 10px 30px -5px rgba(124, 28, 245, 0.08)",
        botcubeyCardHover: "0 20px 35px -5px rgba(124, 28, 245, 0.2)",
        botcubeyBtn: "0 4px 18px 0 rgba(124, 28, 245, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
