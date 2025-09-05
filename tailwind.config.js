/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220 60% 50%)',
        accent: 'hsl(170 60% 50%)',
        'text-primary': 'hsl(220 20% 10%)',
        'text-secondary': 'hsl(220 20% 30%)',
        surface: 'hsl(0 0% 100%)',
        bg: 'hsl(220 20% 95%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 10%, 10%, 0.1)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        'slideUp': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}