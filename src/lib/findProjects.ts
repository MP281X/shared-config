import fs from 'node:fs'
import { parseConfig } from './parseConfig.ts'
import { findGlob } from './findGlob.ts'

const getWorkspaceProjects = (dir: string) => {
	const globs: string[] = []

	// load the package info
	type PackageJSON = { workspaces?: string[] }
	globs.push(...(parseConfig<PackageJSON>(`${dir}/package.json`)?.workspaces ?? []))

	type PNPMWorkspace = { packages?: string[] }
	globs.push(...(parseConfig<PNPMWorkspace>(`${dir}/pnpm-workspace.yaml`)?.packages ?? []))

	return globs.flatMap((glob) => findGlob(glob, { cwd: dir })).filter((path) => fs.existsSync(`${dir}/${path}/package.json`))
}

export type Project = { name: string; scripts: string[]; lspPlugin: boolean; cwd: string }
// find all the projects in a the monorepo/repo
export const findProjects = (dir: string = process.cwd()): Project[] => {
	const projects = getWorkspaceProjects(dir).flatMap((project) => findProjects(project))

	if (projects.length > 0) return projects
	if (!fs.existsSync(`${dir}/package.json`)) return []

	// load the package info
	type PackageJSON = { scripts?: Record<string, string> }
	const { scripts } = parseConfig<PackageJSON>(`${dir}/package.json`) ?? {}

	// read the tsconfig and check if the project is using the custom lsp plugin
	type TSConfig = { compilerOptions?: { plugins?: { name: string }[] } }
	const { compilerOptions } = parseConfig<TSConfig>(`${dir}/tsconfig.json`) ?? {}

	const lspPlugin = compilerOptions?.plugins?.find((x) => x.name === 'lsp-plugin') !== undefined

	return [
		{
			scripts: Object.keys(scripts ?? {}),
			name: dir.split('/').pop() ?? '',
			lspPlugin,
			cwd: dir
		}
	]
}