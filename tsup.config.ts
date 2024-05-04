import { defineConfig } from 'tsup'

export default defineConfig({
	outDir: 'dist',
	entryPoints: ['src/eslint.ts', 'src/prettier.ts'],
	format: ['esm'],
	dts: true,
	shims: true,
	clean: true,
	treeshake: true
})
