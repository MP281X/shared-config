import type { Config } from 'prettier'

const baseConfig = {
	semi: false,
	useTabs: true,
	printWidth: 150,
	singleQuote: true,
	trailingComma: 'none',
	arrowParens: 'always',
	quoteProps: 'consistent',
	experimentalTernaries: true,
	overrides: [{ files: '*.json', options: { parser: 'jsonc' } }],
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-astro', 'prettier-plugin-tailwindcss']
} satisfies Config

export default baseConfig
export const mergeConfig = (config: Config): Config => ({
	...baseConfig,
	...config,
	overrides: [...baseConfig.overrides, ...(config.overrides ?? [])],
	plugins: [...baseConfig.plugins, ...(config.plugins ?? [])]
})
