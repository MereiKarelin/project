/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        moveGradient: {
          to: {
            left: '100%',
          },
        },
        ellipsisWhite: {
          '0%': {
            backgroundColor: '#fff2',
            boxShadow: '32px 0 #fff2, -32px 0 #fff',
          },
          '50%': {
            backgroundColor: '#fff',
            boxShadow: '32px 0 #fff2, -32px 0 #fff2',
          },
          '100%': {
            backgroundColor: '#fff2',
            boxShadow: '32px 0 #fff, -32px 0 #fff2',
          },
        },
        ellipsisGray: {
          '0%': {
            backgroundColor: '#fff2',
            boxShadow: '32px 0 #fff2, -32px 0 #959595',
          },
          '50%': {
            backgroundColor: '#959595',
            boxShadow: '32px 0 #fff2, -32px 0 #fff2',
          },
          '100%': {
            backgroundColor: '#fff2',
            boxShadow: '32px 0 #959595, -32px 0 #fff2',
          },
        },
      },
      screens: {
        xs: '500px',
      },
    },
  },

  plugins: [],
};
