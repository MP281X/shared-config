import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	dts: true,
	entryPoints: ['./src/eslint.ts', './src/prettier.ts'],
	format: ['esm'],
	outDir: 'dist',
	shims: true,
	silent: true,
	splitting: false,
	treeshake: true,
	// eslint-disable-next-line @typescript-eslint/require-await
	onSuccess: async () => console.log('\x1b[36m%s\x1b[0m', '⚡ Build success')
})
