import { defineConfig } from 'tsup'
import { findGlob } from './src/lib/findGlob'

export default defineConfig({
	outDir: 'dist',
	entryPoints: findGlob('src/*.ts'),
	format: ['esm'],
	splitting: false,
	dts: true,
	clean: true,
	shims: true,
	treeshake: true
})
