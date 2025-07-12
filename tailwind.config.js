/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'azul-milenio': '#0033A0', // Placeholder for "Azul Milenio"
        'blanco': '#FFFFFF',
        'primario': {
          DEFAULT: '#0033A0', // Same as Azul Milenio for now
          hover: '#00227A', // A darker shade for hover
        },
        'texto-primario': '#FFFFFF', // Text color on primary background
        // You can add more semantic colors here like 'accent', 'secondary', etc.
        // Or shades of gray for text, borders, backgrounds
        'gris': {
          100: '#f7fafc',
          // ...
          900: '#1a202c',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
