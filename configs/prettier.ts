import type { Config } from 'prettier'

export default {
	arrowParens: 'avoid',
	experimentalTernaries: true,
	overrides: [{ files: '*.json', options: { parser: 'jsonc' } }],
	plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-astro'],
	printWidth: 150,
	quoteProps: 'consistent',
	semi: false,
	singleQuote: true,
	trailingComma: 'none',
	useTabs: true
} satisfies Config
