import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: { DEFAULT: '#1C1513', soft: '#261C19', line: '#3A2C27' },
        ivory: { DEFAULT: '#FAF6F1', soft: '#F3ECE4', deep: '#E9DED2' },
        gold: { light: '#E6C3A8', DEFAULT: '#C08A6C', deep: '#9E6449' },
        ink: { DEFAULT: '#2A201C', muted: '#7A6A62', faint: '#A8978E' },
        line: '#E4D8CD',
      },
      fontFamily: {
        sans: ['var(--font-jost)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      letterSpacing: { luxe: '0.32em' },
    },
  },
  plugins: [],
};
export default config;
