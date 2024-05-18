import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	dts: true,
	entryPoints: ['./src/eslint.ts', './src/prettier.ts'],
	format: ['esm'],
	outDir: 'dist',
	shims: true,
	splitting: false,
	treeshake: true
})
