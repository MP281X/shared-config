import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	dts: true,
	entryPoints: ['./configs/eslint.ts', './configs/prettier.ts', './src/index.ts'],
	format: ['esm'],
	outDir: 'dist',
	shims: true,
	silent: true,
	splitting: false,
	treeshake: true,
	// eslint-disable-next-line @typescript-eslint/require-await
	onSuccess: async () => console.log('\x1b[36m%s\x1b[0m', '⚡ Build success')
})
