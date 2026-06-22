/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fun: ['"Baloo 2"', '"Comic Sans MS"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        bouncey: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-120px) scale(1.6)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-10px)' },
          '40%, 80%': { transform: 'translateX(10px)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.4) rotate(20deg)', opacity: '0.7' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.4s ease-out',
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        bouncey: 'bouncey 1s ease-in-out infinite',
        'float-up': 'float-up 1s ease-out forwards',
        shake: 'shake 0.5s ease-in-out',
        sparkle: 'sparkle 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
