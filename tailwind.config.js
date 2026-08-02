/** @type {import('tailwindcss').Config} */
export default {
  // 🌙 Tungi rejim (Dark mode) tugmasi ishlashi uchun shart!
  darkMode: 'class',

  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Asosiy brend korporativ ko'k rangi
        brand: "#1B365D",
        brandHover: "#132743",

        // Boshqa mavjud ranglar
        ink: "#0B1220",
        panel: "#121C30",
        panelLight: "#182642",
        border: "#233252",
        gold: "#E8B34C",
        goldDark: "#B8862E",
        mist: "#8CA0C4",
        danger: "#E5484D",
        success: "#3DD68C",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};