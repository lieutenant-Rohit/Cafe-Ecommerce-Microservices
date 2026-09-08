/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF7EE',
          100: '#F7EFE1',
          200: '#EFE2CC',
          300: '#E5D1B2',
          400: '#D9BC94',
        },
        coffee: {
          100: '#EADFD3',
          300: '#A98D77',
          400: '#8A6A52',
          500: '#6F4E37',
          600: '#55392A',
          700: '#42291D',
          800: '#322014',
          900: '#2B1D13',
          950: '#20130C',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          50: '#F8E3D8',
          100: '#F3D2BE',
          200: '#EFC7B2',
          300: '#E3A186',
          400: '#D37E58',
          500: '#C2643A',
          600: '#A94E2C',
          700: '#8C3D24',
          800: '#6E2F1D',
          900: '#572715',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
          50: '#f0f7f4',
          100: '#dbede2',
          200: '#b9dcc8',
          300: '#8ac3a6',
          400: '#5aa682',
          500: '#3a8a68',
          600: '#2b6f53',
          700: '#235944',
          800: '#1e4838',
          900: '#1a3b2f',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        steamDrift: {
          '0%': { opacity: '0', transform: 'translateY(0) scaleX(1)' },
          '15%': { opacity: '0.7' },
          '50%': { opacity: '0.4', transform: 'translateY(-30px) scaleX(1.4)' },
          '100%': { opacity: '0', transform: 'translateY(-60px) scaleX(0.6)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s infinite',
        float: 'float 6s ease-in-out infinite',
        steamDrift: 'steamDrift 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

