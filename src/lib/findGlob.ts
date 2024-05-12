declare module 'node:fs' {
	type GlobSyncOptions = { cwd?: string; exclude?: (path: string) => boolean }
	export function globSync(pattern: string | string[], options?: GlobSyncOptions): string[]
}

import fs from 'node:fs'

import { parseConfig } from './parseConfig'

const gitIgnore = parseConfig<string[]>(`${process.cwd()}/.gitignore`) ?? []

export const findGlob: typeof fs.globSync = (glob, options) => {
	if (options === undefined) options = {}
	if (options.cwd === undefined) options.cwd = process.cwd()

	return fs
		.globSync(glob, { cwd: options.cwd, exclude: path => options.exclude?.(path) || gitIgnore.includes(path) })
		.filter(file => fs.statSync(`${options.cwd}/${file}`).isFile())
}

if (import.meta.vitest) {
	const { assert, it } = import.meta.vitest

	it('glob search', () => {
		const results = findGlob('*.ts', { cwd: __dirname })
		assert.include(results, 'findGlob.ts')
	})
}
