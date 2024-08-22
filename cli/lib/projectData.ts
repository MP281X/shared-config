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
