import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        teal: {
          dark: '#2d6a6f',
          DEFAULT: '#5f9ea0',
          light: '#7ec8ca',
        },
        coral: '#e05252',
        'coral-dark': '#c43c3c',
      },
      keyframes: {
        coinSpin: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-160px 0' },
        },
        fishBounceIn: {
          '0%': { transform: 'scale(0) translateY(20px)', opacity: '0' },
          '60%': { transform: 'scale(1.2) translateY(-5px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        fishSlideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(200px)', opacity: '0' },
        },
        fadeInDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        modalIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        coinSpin: 'coinSpin 0.8s steps(8) infinite',
        fishBounceIn: 'fishBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        fishSlideOut: 'fishSlideOut 0.6s ease-in forwards',
        fadeInDown: 'fadeInDown 0.3s ease-out forwards',
        modalIn: 'modalIn 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
