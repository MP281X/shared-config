import { defineWorkspace } from 'vitest/config'

import { findProjects } from './lib/findProjects'
export default defineWorkspace(
	findProjects().map(({ cwd, name }) => ({
		test: {
			clearScreen: false,
			environment: 'node',
			includeSource: ['**/*.{ts,tsx,js,jsx}'],
			name,
			project: name,
			root: cwd
		}
	}))
)
