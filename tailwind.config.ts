import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: '#F7F6F2',
        surface: '#FFFFFF',
        charcoal: {
          DEFAULT: '#252722',
          900: '#1A1C18',
          800: '#252722',
          700: '#3D4039',
          600: '#52554E',
        },
        muted: {
          DEFAULT: '#73766F',
          700: '#5C5E58',
          600: '#73766F',
          500: '#8A8D86',
          400: '#A4A7A0',
          300: '#BCBFAF',
        },
        neutral: {
          border: '#E6E5DF',
          divider: '#E6E5DF',
          subtle: '#EFEFEA',
          hover: '#F2F1ED',
        },
        forest: {
          DEFAULT: '#426B53',
          50: '#F4F7F4',
          100: '#EAF0E9',
          200: '#D5E2D4',
          300: '#B8CEB7',
          500: '#537F66',
          600: '#426B53',
          700: '#345541',
          800: '#274132',
          900: '#1D3025',
        },
        sage: {
          DEFAULT: '#EAF0E9',
          light: '#F4F7F4',
          border: '#CFDDCF',
          text: '#2F4F3D',
        },
        warning: {
          DEFAULT: '#A66B16',
          text: '#A66B16',
          bg: '#FAF5EB',
          border: '#EEDCBE',
          hover: '#F5ECDB',
        },
        danger: {
          DEFAULT: '#B54747',
          text: '#B54747',
          bg: '#FDF2F2',
          border: '#EFCACA',
          hover: '#FBE8E8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '0.875rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(37, 39, 34, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(37, 39, 34, 0.08), 0 1px 2px -1px rgba(37, 39, 34, 0.08)',
        md: '0 2px 4px -1px rgba(37, 39, 34, 0.06), 0 2px 4px -1px rgba(37, 39, 34, 0.04)',
      },
    },
  },
  plugins: [],
};
export default config;
