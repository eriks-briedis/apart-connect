import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      safelist: [
        'bg-green-500',
        'bg-green-700',
        'bg-blue-500',
        'bg-blue-700',
        'bg-red-500',
        'bg-red-700',
        'bg-yellow-500',
        'bg-yellow-700',
      ],
    },
  },
  plugins: [],
}
export default config
