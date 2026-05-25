/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment:  '#f5ede0',
        ink:        '#2c1a0e',
        leather:    '#7a4f2d',
        caramel:    '#9e6840',
        sepia:      '#e2cdb0',
        cream:      '#fffdf9',
        sage:       '#5f7a45',
        rust:       '#b84040',
      },
      fontFamily: {
        serif:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
        elegant: ['"EB Garamond"', 'Georgia', 'serif'],
        sans:    ['"Inter"', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'book': '-6px 0 0 0 #7a4f2d, -8px 2px 12px rgba(0,0,0,0.25), 0 4px 24px rgba(0,0,0,0.10)',
        'book-hover': '-6px 0 0 0 #7a4f2d, -10px 6px 20px rgba(0,0,0,0.30), 0 12px 40px rgba(0,0,0,0.15)',
        'inset-paper': 'inset 0 2px 8px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
