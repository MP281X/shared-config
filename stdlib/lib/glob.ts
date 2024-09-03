declare module 'node:fs' {
	type GlobSyncOptions = {
		cwd?: string
		exclude?: (path: string) => boolean
		withFileTypes?: boolean
	}

	function globSync(pattern: string | string[], options?: GlobSyncOptions): string[]
}

import { globSync } from 'node:fs'

export function glob(pattern: string | string[]) {
	return globSync(pattern, {
		exclude: file => file.includes('node_modules') || file.includes('.git'),
		cwd: process.cwd()
	})
}
