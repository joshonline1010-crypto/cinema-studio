/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'vs-dark': '#0a0a0f',
        'vs-card': '#12121a',
        'vs-border': '#1e1e2e',
        'vs-accent': '#8b5cf6',
        'vs-accent-hover': '#a78bfa',
      }
    },
  },
  plugins: [],
}
