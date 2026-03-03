/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black:      '#0A0708',
          deepPurple: '#1A0A2E',
          purple:     '#2D1B5E',
          violet:     '#4A2C8A',
          gold:       '#C9A84C',
          lightGold:  '#E8C97A',
          cream:      '#F5EDD6',
          offWhite:   '#FAF6EE',
          rose:       '#8B3A52',
          teal:       '#1A5C6B',
        },
      },
      fontFamily: {
        cinzel:    ['Cinzel', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        raleway:   ['Raleway', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #0A0708 0%, #1A0A2E 50%, #0A0708 100%)',
        'gold-gradient':   'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)',
        'hero-radial':     'radial-gradient(ellipse at center, #2D1B5E 0%, #1A0A2E 40%, #0A0708 100%)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
        'shimmer':    'shimmer 3s linear infinite',
        'fadeInUp':   'fadeInUp 0.8s ease forwards',
        'starTwinkle':'starTwinkle 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px #C9A84C44, 0 0 10px #C9A84C22' },
          '100%': { boxShadow: '0 0 20px #C9A84C88, 0 0 40px #C9A84C44' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        starTwinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.3)' },
        },
      },
      boxShadow: {
        'gold':       '0 0 20px rgba(201, 168, 76, 0.4)',
        'gold-lg':    '0 0 40px rgba(201, 168, 76, 0.6)',
        'cosmic':     '0 8px 32px rgba(10, 7, 8, 0.8)',
        'card':       '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
