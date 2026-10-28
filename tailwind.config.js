/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#040506',
        ink: '#07080a',
        obsidian: '#0d0f12',
        graphite: '#15181c',
        hairline: '#262930',
        smoke: '#626773',
        ash: '#949aa6',
        coral: '#ff6363',
        amberWarning: '#f59e0b',
        emeraldActive: '#59d499',
        cyanRadar: '#38bdf8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
