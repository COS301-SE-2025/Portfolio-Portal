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
        'dark-bg': '#0a0a2e',
        'dark-surface': '#16213e',
        'light-bg': '#ffffff',
        'light-surface': '#f8fafc',
      }
    },
  },
  plugins: [],
}
