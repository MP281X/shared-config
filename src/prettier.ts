import type { Config } from 'prettier'

export default {
	semi: false,
	useTabs: true,
	printWidth: 150,
	singleQuote: true,
	trailingComma: 'none',
	arrowParens: 'always',
	quoteProps: 'consistent',
	importOrderSortSpecifiers: true,
	overrides: [{ files: '*.json', options: { parser: 'jsonc' } }],
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-astro', 'prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports']
} satisfies Config
