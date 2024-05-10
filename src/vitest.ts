import { defineWorkspace } from 'vitest/config'

import { findGlob } from './lib/findGlob'
import { findProjects } from './lib/findProjects'

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
