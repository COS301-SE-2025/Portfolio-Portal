/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // You can add custom dark mode colors here if needed
      colors: {
        // Example custom colors for better dark/light theme support
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'light-bg': '#ffffff',
        'light-surface': '#f8fafc',
      }
    },
  },
  plugins: [],
}