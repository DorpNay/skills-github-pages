/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.md',
    './notebook/**/*.{html,js}',
    './workspace/**/*.{html,js}',
    './assets/js/**/*.js'
  ],
  theme: { extend: {} },
  plugins: [],
  safelist: [
    'hidden', 'block', 'flex', 'inline-flex', 'grid',
    'pointer-events-none', 'pointer-events-auto',
    'opacity-0', 'opacity-100'
  ]
};
