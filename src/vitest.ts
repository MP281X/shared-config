import { defineWorkspace } from 'vitest/config'

import { findProjects } from './lib/findProjects'
export default defineWorkspace(
	findProjects().map(({ name, cwd }) => ({
		test: {
			name,
			root: cwd,
			project: name,
			clearScreen: false,
			environment: 'node',
			includeSource: ['**/*.{ts,js}']
		}
	}))
)
