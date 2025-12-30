import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],

  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },

      colors: {
        ogun: 'oklch(40% 0.15 260)',
        oshun: 'oklch(85% 0.18 95)',
        shango: 'oklch(55% 0.22 30)',
        oya: 'oklch(65% 0.20 330)',
      },

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },

      typography: {
        DEFAULT: {
          css: {
            color: 'oklch(30% 0.05 260)',
            a: { color: 'oklch(55% 0.22 30)' },
          },
        },
      },
    },
  },

  plugins: [forms, typography, containerQueries],
};