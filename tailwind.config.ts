import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        telos: {
          cyan: '#00F2FE',
          blue: '#4FACFE',
          purple: '#C471F5',
        },
        background: {
          light: 'hsl(240, 5%, 96%)',
          dark: 'hsl(240, 10%, 6%)',
        },
        card: {
          light: 'white',
          dark: 'hsl(240, 10%, 12%)',
        },
        border: {
          light: 'hsl(240, 5%, 90%)',
          dark: 'hsl(240, 10%, 20%)',
        },
        text: {
          primary: 'hsl(240, 10%, 10%)',
          'primary-dark': 'hsl(240, 5%, 95%)',
          secondary: 'hsl(240, 5%, 40%)',
          'secondary-dark': 'hsl(240, 5%, 70%)',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config