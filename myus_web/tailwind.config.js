/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background surfaces (Linear's dark luminance stack)
        marketing: '#08090a',
        panel:     '#0f1011',
        surface:   '#191a1b',
        elevated:  '#28282c',

        // Text hierarchy
        'text-primary':   '#f7f8f8',
        'text-secondary': '#d0d6e0',
        'text-muted':     '#8a8f98',
        'text-subtle':    '#62666d',

        // Brand (Linear indigo-violet)
        primary:   '#5e6ad2',
        accent:    '#7170ff',
        'accent-hover': '#828fff',

        // Status
        success: '#10b981',
        error:   '#ef4444',
        warning: '#f59e0b',

        // Borders (semi-transparent white for dark surfaces)
        'border-subtle':   'rgba(255,255,255,0.05)',
        'border-standard': 'rgba(255,255,255,0.08)',
        'border-light':     'rgba(255,255,255,0.12)',
        // Solid dark borders for comparison / light contexts
        'line-dark':  '#141516',
        'line-dim':   '#18191a',
        'border-dark': '#23252a',
        'border-mid':  '#34343a',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.63rem', { lineHeight: '1.5', letterSpacing: '-0.15px' }],
      },
      borderRadius: {
        sm:  '2px',
        DEFAULT: '4px',
        md:  '6px',
        lg:  '8px',
        xl:  '12px',
        '2xl': '22px',
      },
      boxShadow: {
        // Linear uses luminance stepping, not shadows on dark surfaces
        // Inset for recessed panels
        inset:  'rgba(0,0,0,0.2) 0px 0px 12px 0px inset',
        // Dialog/modal multi-layer
        dialog: 'rgba(0,0,0,0) 0px 8px 2px, rgba(0,0,0,0.01) 0px 5px 2px, rgba(0,0,0,0.04) 0px 3px 2px, rgba(0,0,0,0.07) 0px 1px 1px, rgba(0,0,0,0.08) 0px 0px 1px',
        // Elevated (dropdowns, popovers)
        elevated: '0px 2px 4px rgba(0,0,0,0.4)',
        // Focus ring
        focus:    '0px 0px 0px 1px rgba(0,0,0,0.1), 0px 4px 12px rgba(0,0,0,0.1)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
