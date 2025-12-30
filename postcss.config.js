const isProd = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production';

export default {
  plugins: {
    // Core: CSS nesting with full spec alignment
    'postcss-nesting': {},

    // tailwind is used via PostCSS (use the maintained PostCSS plugin package)
    '@tailwindcss/postcss': {},

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
    // Note: postcss-custom-media "importFrom" option removed because newer
    // versions no longer support it. Define custom media queries inline
    // in your CSS or migrate to `postcss-preset-env` if you need to use
    // centralized imports.

    // Optional: Logical properties for cross‑platform layouts
    'postcss-logical': {},

    // Optional: Color functions (lab(), oklch(), etc.)
    'postcss-color-function': {},
  },
};
