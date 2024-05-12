import type { Expression } from 'typescript'

import fs from 'fs'

import { findGlob } from './findGlob'
import { nodeToStr, constFactory, objectFactory, asyncArrowFnFactory, defaultExportFactory, dynamicImportFactory } from './tsFactory.ts'

const fileImportsObj = (glob: string) => {
	const fileImports = new Map<string, Expression>()

	for (const file of findGlob(glob)) fileImports.set(file, dynamicImportFactory(`./${file}`))

	return objectFactory(Object.fromEntries(fileImports))
}

const globImportsObj = (globImports: string[]) => {
	const _globImports = new Map<string, Expression>()

	for (const glob of globImports) _globImports.set(glob, asyncArrowFnFactory(fileImportsObj(glob)))

	return objectFactory(Object.fromEntries(_globImports))
}

type GenGlobImportsFile = { cwd: string; globImports: string[] }
export const genGlobImportsFile = ({ cwd, globImports }: GenGlobImportsFile) => {
	const out: string[] = []

	out.push(nodeToStr(constFactory('imports', globImportsObj(globImports))))

	out.push(`
type Imports = {
	[Glob in keyof typeof imports]: () => Promise<{
		[File in keyof Awaited<ReturnType<(typeof imports)[Glob]>>]: {
			[Export in keyof Awaited<ReturnType<(typeof imports)[Glob]>>[File]]: Awaited<ReturnType<(typeof imports)[Glob]>>[File][Export]
		}
	}>
}
	`)

	out.push(nodeToStr(defaultExportFactory('imports', 'Imports')))

	fs.writeFileSync(`${cwd}/imports.g.ts`, out.join('\n\n'))
}

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest

	it('file imports obj', () => {
		const code = nodeToStr(fileImportsObj('**/globImports.ts'))
		const expectedCode = '{ "src/lib/globImports.ts": await import("./src/lib/globImports.ts") }'
		expect(code.replaceAll('\n', ' ').replace(/\s+/g, ' ')).toEqual(expectedCode)
	})

	it('glob imports obj', () => {
		const code = nodeToStr(globImportsObj(['**/noFiles']))
		const expectedCode = '{ "**/noFiles": async () => ({}) }'
		expect(code.replaceAll('\n', ' ').replace(/\s+/g, ' ')).toEqual(expectedCode)
	})
}
