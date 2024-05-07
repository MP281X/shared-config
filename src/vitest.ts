import { defineWorkspace } from 'vitest/config'
import { findProjects } from './lib/findProjects'
import { findGlob } from './lib/findGlob'

export default defineWorkspace(
	findProjects().map(({ name, cwd }) => ({
		test: {
			name,
			root: cwd,
			project: name,
			clearScreen: false,
			environment: 'node',
			includeSource: ['**/*.{ts,js}'],
			globalSetup: findGlob('**/setup.vitest.ts')
		}
	}))
)
