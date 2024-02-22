/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'custom': 'Comic Sans MS'
      },
  
      
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.custom-rounded': {
          'border-radius': '4rem 0 4rem 0',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}

