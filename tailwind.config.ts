import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: { DEFAULT: '#1C1513', soft: '#261C19', line: '#3A2C27' },
        ivory: { DEFAULT: '#F8F1E6', soft: '#F1E6D6', deep: '#E7D8C3' },
        gold: { light: '#E6C3A8', DEFAULT: '#C08A6C', deep: '#9E6449' },
        ink: { DEFAULT: '#2A201C', muted: '#7A6A62', faint: '#A8978E' },
        line: '#E5D7C2',
      },
      fontFamily: {
        sans: ['var(--font-jost)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        // Desain v2
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { luxe: '0.32em' },
    },
  },
  plugins: [],
};
export default config;
