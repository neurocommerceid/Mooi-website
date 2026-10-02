import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          light: '#C89078',
          DEFAULT: '#B5705A',
          deep: '#A9624B',
        },
        cream: {
          bg: '#FDFAF8',
          soft: '#F6E7DF',
          mid: '#EFD8CC',
          deep: '#E3BFAE',
        },
        ink: {
          DEFAULT: '#4A3730',
          muted: '#7B655C',
        },
        line: '#F0E4DD',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
