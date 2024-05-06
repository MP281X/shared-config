import fs from 'fs'
import process from 'process'

// parse json file
const parseJson = <TResType extends Record<string, unknown>>(path: string): TResType => {
	try {
		const file = fs.readFileSync(path)
		const json = JSON.parse(file.toString()) as Record<string, unknown>

		return json as TResType
	} catch {}

	return {} as TResType
}

export type Project = { name: string; scripts: string[]; lspPlugin: boolean; cwd: string }
// find all the projects in a the monorepo/repo
export const findProjects = async (dir?: string) => {
	if (!dir) dir = process.cwd()
	const files = fs.readdirSync(dir)

	if (files.includes('package.json') && !files.includes('pnpm-workspace.yaml')) {
		// load the package info
		type PackageJSON = { scripts?: Record<string, string> }
		const { scripts } = parseJson<PackageJSON>(`${dir}/package.json`)

		// read the tsconfig and check if the project is using the custom lsp plugin
		type TSConfig = { compilerOptions?: { plugins?: { name: string }[] } }
		const { compilerOptions } = parseJson<TSConfig>(`${dir}/tsconfig.json`)
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

	const projects: Project[] = []
	const subdirectories = files.filter((file) => file !== 'node_modules' && fs.statSync(`${dir}/${file}`).isDirectory())

	for (const subdir of subdirectories) projects.push(...(await findProjects(`${dir}/${subdir}`)))

	return projects
}
