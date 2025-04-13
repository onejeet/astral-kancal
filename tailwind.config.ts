/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          gradientStart: '#3b82f6',
          gradientEnd: '#8b5cf6',
        },
      },
      backgroundImage: {
        'gradient-header': 'linear-gradient(to right, #3b82f6, #8b5cf6)',
        'gradient-body': 'linear-gradient(135deg, #f6f8ff 0%, #eef1f9 100%)',
        'gradient-badge': 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      },
    },
  },
  plugins: [],
};
