const isProd = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production';

export default {
  plugins: {
    // Core: CSS nesting with full spec alignment
    'postcss-nesting': {},

    // tailwind is used via PostCSS
    tailwindcss: {},

    // Autoprefixer with modern browser targeting
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace',
    },

    // Minify intelligently for production
    ...(isProd
      ? {
          cssnano: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
              },
            ],
          },
        }
      : {}),

    // Optional: Custom media queries for design systems
    'postcss-custom-media': {
      importFrom: [
        {
          customMedia: {
            '--sm': '(min-width: 640px)',
            '--md': '(min-width: 768px)',
            '--lg': '(min-width: 1024px)',
            '--xl': '(min-width: 1280px)',
          },
        },
      ],
    },

    // Optional: Logical properties for cross‑platform layouts
    'postcss-logical': {},

    // Optional: Color functions (lab(), oklch(), etc.)
    'postcss-color-function': {},
  },
};