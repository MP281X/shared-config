import { defineConfig } from 'tsup'

export default defineConfig({
	outDir: 'dist',
	entryPoints: ['src/eslint.ts', 'src/prettier.ts', 'src/task-runner.ts'],
	format: ['esm'],
	dts: true,
	clean: true,
	shims: true,
	treeshake: true
})
