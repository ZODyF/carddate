/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        candle: {
          bg: '#1A1715',
          card: '#26221E',
          cardLight: '#2F2A25',
          border: '#3D3630',
          borderSubtle: '#4D443D',
          amber: '#E0A96D',
          amberHover: '#EBB983',
          amberDark: '#D48C46',
          amberGlow: 'rgba(224, 169, 109, 0.15)',
          cream: '#FAF3E0',
          muted: '#A39281',
          subtle: '#6E6257'
        }
      },
      boxShadow: {
        'candle-glow': '0 0 50px -10px rgba(224, 169, 109, 0.18)',
        'candle-accent': '0 0 30px rgba(224, 169, 109, 0.25)',
        'card-warm': '0 16px 40px -10px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(224, 169, 109, 0.12)',
        'card-back': '0 10px 25px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(61, 54, 48, 0.6)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '25%': { opacity: '0.8', transform: 'scale(0.98) translateY(1px)' },
          '50%': { opacity: '1', transform: 'scale(1.02) translateY(-1px)' },
          '75%': { opacity: '0.85', transform: 'scale(0.99)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.28' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'candle-flicker': 'flicker 4s ease-in-out infinite',
        'candle-pulse': 'pulseSlow 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
