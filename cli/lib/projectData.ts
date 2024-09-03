import fs from 'node:fs'

export const packageManager = () => process.env['npm_execpath'] ?? 'pnpm'

export const hasPackage = (packageName: string) => {
	type PackageJson = { dependencies?: Record<string, string>; devDependencies?: Record<string, string> }
	const packageJson: PackageJson = JSON.parse(fs.readFileSync('package.json').toString())

	const packages = [...Object.keys(packageJson.dependencies ?? {}), ...Object.keys(packageJson.devDependencies ?? {})]
	return packages.includes(packageName)
}

export const hasDockerCompose = () => {
	return fs.existsSync(`${process.cwd()}/docker-compose.yaml`)
}

export const currentPackageRoot = (dir = import.meta.dirname): string => {
	if (dir.trim() === '') return process.cwd()
	if (dir === process.cwd()) return dir

	const packageJSON = dir + '/package.json'
	if (fs.existsSync(packageJSON)) return dir

	const parentDir = dir.split('/').slice(0, -1).join('/')
	return currentPackageRoot(parentDir)
}
