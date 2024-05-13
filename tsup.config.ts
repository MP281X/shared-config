import { defineConfig } from 'tsup'

import { findGlob } from './src/lib/findGlob'

export default defineConfig({
	clean: true,
	dts: true,
	entryPoints: findGlob('src/*.ts', { type: 'file' }),
	format: ['esm'],
	outDir: 'dist',
	shims: true,
	splitting: false,
	treeshake: true
})
