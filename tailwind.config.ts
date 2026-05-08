import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A3C5E',
          50:  '#EEF3F8',
          100: '#D6E4F0',
          200: '#ADC9E1',
          300: '#84AED2',
          400: '#5B93C3',
          500: '#3278B4',
          600: '#265D8C',
          700: '#1A3C5E',
          800: '#0E2035',
          900: '#07101C',
        },
        gold: {
          DEFAULT: '#C9A84C',
          50:  '#FDF9EE',
          100: '#FAF1D1',
          200: '#F5E3A3',
          300: '#EFD475',
          400: '#E9C647',
          500: '#C9A84C',
          600: '#A07E2A',
          700: '#785F20',
          800: '#503F15',
          900: '#28200B',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 4px 24px rgba(26,60,94,0.12), 0 1px 4px rgba(26,60,94,0.08)',
        'luxury-lg': '0 8px 48px rgba(26,60,94,0.16), 0 2px 8px rgba(26,60,94,0.1)',
      },
    },
  },
  plugins: [],
}
export default config
