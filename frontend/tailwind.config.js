/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 dark scheme, seeded from the original indigo/violet brand
        primary: '#A5B4FC',
        'on-primary': '#1E1B4B',
        'primary-container': '#3730A3',
        'on-primary-container': '#E0E7FF',
        'primary-fixed': '#E0E7FF',
        'primary-fixed-dim': '#C7D2FE',
        'on-primary-fixed': '#1E1B4B',
        'on-primary-fixed-variant': '#3730A3',

        secondary: '#C4B5FD',
        'on-secondary': '#2E1065',
        'secondary-container': '#5B21B6',
        'on-secondary-container': '#EDE9FE',
        'secondary-fixed': '#EDE9FE',
        'secondary-fixed-dim': '#DDD6FE',
        'on-secondary-fixed': '#2E1065',
        'on-secondary-fixed-variant': '#5B21B6',

        tertiary: '#7DD3FC',
        'on-tertiary': '#082F49',
        'tertiary-container': '#0369A1',
        'on-tertiary-container': '#E0F2FE',
        'tertiary-fixed': '#E0F2FE',
        'tertiary-fixed-dim': '#BAE6FD',
        'on-tertiary-fixed': '#082F49',
        'on-tertiary-fixed-variant': '#0369A1',

        error: '#F2B8B5',
        'on-error': '#601410',
        'error-container': '#8C1D18',
        'on-error-container': '#F9DEDC',

        background: '#0F172A',
        'on-background': '#E2E8F0',

        surface: '#0F172A',
        'on-surface': '#E2E8F0',
        'surface-dim': '#0B1120',
        'surface-bright': '#334155',
        'surface-variant': '#45475A',
        'on-surface-variant': '#94A3B8',
        'surface-tint': '#A5B4FC',

        'surface-container-lowest': '#0A0F1D',
        'surface-container-low': '#131B2E',
        'surface-container': '#1A2338',
        'surface-container-high': '#212B42',
        'surface-container-highest': '#2B3650',

        outline: '#64748B',
        'outline-variant': '#334155',

        'inverse-surface': '#E2E8F0',
        'inverse-on-surface': '#1A2338',
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '4rem' }],
        'display-md': ['2.8125rem', { lineHeight: '3.25rem' }],
        'headline-xl': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'headline-lg': ['1.75rem', { lineHeight: '2.25rem' }],
        'headline-lg-mobile': ['1.5rem', { lineHeight: '2rem' }],
        'headline-md': ['1.5rem', { lineHeight: '2rem' }],
        'title-lg': ['1.375rem', { lineHeight: '1.75rem' }],
        'title-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.5rem' }],
        'body-md': ['0.875rem', { lineHeight: '1.25rem' }],
        'label-md': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        caption: ['0.75rem', { lineHeight: '1rem' }],
      },
      spacing: {
        'stack-md': '1.5rem',
        'stack-lg': '2rem',
        'margin-mobile': '1rem',
        'margin-desktop': '2rem',
        gutter: '1.5rem',
      },
      maxWidth: {
        'container-max': '1280px',
      },
    },
  },
  plugins: [],
}
