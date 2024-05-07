declare module 'node:fs' {
	type GlobSyncOptions = { cwd?: string; exclude?: (path: string) => boolean }
	export function globSync(pattern: string | string[], options?: GlobSyncOptions): string[]
}

import fs from 'node:fs'
import { parseConfig } from './parseConfig'

const gitIgnore = parseConfig<string[]>(`${process.cwd()}/.gitignore`) ?? []

export const findGlob: typeof fs.globSync = (glob, options) =>
	fs.globSync(glob, {
		cwd: options?.cwd ?? process.cwd(),
		exclude: (path) => options?.exclude?.(path) || gitIgnore.includes(path)
	})

if (import.meta.vitest) {
	const { it, assert } = import.meta.vitest

	it('glob search', () => {
		const results = findGlob('*.ts', { cwd: __dirname })
		assert.include(results, 'findGlob.ts')
	})
}
