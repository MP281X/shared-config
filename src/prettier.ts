import type { Config } from 'prettier'

export default {
	semi: false,
	useTabs: true,
	printWidth: 150,
	singleQuote: true,
	trailingComma: 'none',
	arrowParens: 'avoid',
	quoteProps: 'consistent',
	experimentalTernaries: true,
	overrides: [{ files: '*.json', options: { parser: 'jsonc' } }],
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-astro', 'prettier-plugin-tailwindcss']
} satisfies Config
