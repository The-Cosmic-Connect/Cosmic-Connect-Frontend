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
          black:      'rgb(var(--cosmic-black) / <alpha-value>)',
          deepPurple: 'rgb(var(--cosmic-deep-purple) / <alpha-value>)',
          purple:     'rgb(var(--cosmic-purple) / <alpha-value>)',
          violet:     'rgb(var(--cosmic-violet) / <alpha-value>)',
          gold:       'rgb(var(--cosmic-gold) / <alpha-value>)',
          lightGold:  'rgb(var(--cosmic-light-gold) / <alpha-value>)',
          cream:      'rgb(var(--cosmic-cream) / <alpha-value>)',
          offWhite:   'rgb(var(--cosmic-off-white) / <alpha-value>)',
          rose:       'rgb(var(--cosmic-rose) / <alpha-value>)',
          teal:       'rgb(var(--cosmic-teal) / <alpha-value>)',
          ink:        'rgb(var(--cosmic-ink) / <alpha-value>)',
        },
      },
      fontFamily: {
        // ── Type system ────────────────────────────────────────────
        //   font-cinzel    → Montserrat        (headings, page titles)
        //   font-cormorant → Montserrat        (quotes, taglines — use italic + weight 300)
        //   font-raleway   → Plus Jakarta Sans (nav, UI, buttons, filter labels)
        //   font-roboto    → Roboto            (long-form body, descriptions)
        //   font-script    → Dancing Script    (decorative accents — use sparingly)
        //
        // Legacy class names (cinzel/cormorant/raleway) are preserved so
        // existing components don't need to be touched; only the underlying
        // font family was swapped.
        cinzel:    ['Montserrat', 'system-ui', 'sans-serif'],
        cormorant: ['Montserrat', 'system-ui', 'sans-serif'],
        raleway:   ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        roboto:    ['Roboto', 'system-ui', 'sans-serif'],
        script:    ['Dancing Script', 'cursive'],
        // Aliases by intent (preferred for any new code)
        display:   ['Montserrat', 'system-ui', 'sans-serif'],
        ui:        ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body:      ['Roboto', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, rgb(var(--cosmic-black)) 0%, rgb(var(--cosmic-deep-purple)) 50%, rgb(var(--cosmic-black)) 100%)',
        'gold-gradient':   'linear-gradient(135deg, rgb(var(--cosmic-gold)) 0%, rgb(var(--cosmic-light-gold)) 50%, rgb(var(--cosmic-gold)) 100%)',
        'hero-radial':     'radial-gradient(ellipse at center, rgb(var(--cosmic-purple)) 0%, rgb(var(--cosmic-deep-purple)) 40%, rgb(var(--cosmic-black)) 100%)',
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
