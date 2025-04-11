// tailwind.config.js (ensure it looks something like this)
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { // Blue
          light: '#60a5fa', DEFAULT: '#3b82f6', dark: '#2563eb', darkest: '#1e40af' // Added darker
        },
        secondary: { // Teal
          light: '#5eead4', DEFAULT: '#14b8a6', dark: '#0f766e', darkest: '#134e4a' // Added darker
        },
        neutral: { // Gray
          lightest: '#f9fafb', light: '#f3f4f6', DEFAULT: '#d1d5db', med: '#9ca3af', // Added med
          dark: '#6b7280', darker: '#374151', darkest: '#1f2937'
        },
        success: { light: '#dcfce7', DEFAULT: '#22c55e', dark: '#16a34a' }, // Added light/dark
        warning: { light: '#fef3c7', DEFAULT: '#f59e0b', dark: '#d97706' }, // Added light/dark
        error: { light: '#fee2e2', DEFAULT: '#ef4444', dark: '#dc2626' }, // Added light/dark
      },
    },
  },
  plugins: [
    import('@tailwindcss/forms'), // Updated to use ES module syntax
  ],
}