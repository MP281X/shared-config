declare module 'node:fs' {
	type GlobSyncOptions = { cwd?: string; exclude?: (path: string) => boolean }
	export function globSync(pattern: string | string[], options?: GlobSyncOptions): string[]
}

import fs from 'node:fs'

import { parseConfig } from './parseConfig'

const gitIgnore = parseConfig<string[]>(`${process.cwd()}/.gitignore`) ?? []

type FindGlobOptions = { cwd?: string; type: 'file' | 'directory' }
export const findGlob = (glob: string | string[], options: FindGlobOptions) => {
	if (options.cwd === undefined) options.cwd = process.cwd()

	return fs.globSync(glob, { cwd: options.cwd, exclude: path => gitIgnore.includes(path) }).filter(file => {
		const fileStats = fs.statSync(`${options.cwd}/${file}`)

		// prettier-ignore
		switch(options.type) {
				case "file": return fileStats.isFile()
				case "directory": return fileStats.isDirectory()
				default: return true
			}
	})
}

if (import.meta.vitest) {
	const { assert, it } = import.meta.vitest

	it('glob search (file)', () => {
		const results = findGlob('*.ts', { cwd: __dirname, type: 'file' })
		assert.include(results, 'findGlob.ts')
	})

	it('glob search (directory)', () => {
		const results = findGlob('../*', { cwd: __dirname, type: 'directory' })
		assert.include(results, '../lib')
	})
}
