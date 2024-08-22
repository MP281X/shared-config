import fs from 'node:fs'
import { projectName } from './projectData.ts'

const tsconfig = `
{ "extends": ["@mp281x/shared-config/tsconfig"] }
`.trimStart()

const biome = `
{ "extends": ["@mp281x/shared-config/biome"] }
`.trimStart()

const gitignore = `
# svelte/next
**/.svelte-kit
**/.next
**/next-env.d.ts

# build output
**/dist
**/build

# generated files
**/*.g.ts
**/.codegen/**/*
**/*.tsbuildinfo

# vite
**/vite.config.js.timestamp-*
**/vite.config.ts.timestamp-*

# other files/folders
**/.env
**/.DS_Store
**/node_modules
**/pnpm-lock.yaml
`.trimStart()

const packageJSON = `
{
  "name": "${projectName()}",
	"type": "module",

	"scripts": {
		"dev": "x index.ts",

		"fix": "x fix",
		"check": "x check",
		"setup": "x setup"
	},

	"devDependencies": { "@mp281x/shared-config": "latest" }
}
`.trimStart()

const indexTS = `
console.log('${projectName()}')
`.trimStart()

export const configProject = () => {
	fs.writeFileSync('tsconfig.json', tsconfig)
	fs.writeFileSync('biome.jsonc', biome)
	fs.writeFileSync('.gitignore', gitignore)

	if (fs.existsSync('package.json') === false) {
		fs.writeFileSync('package.json', packageJSON)
		fs.writeFileSync('index.ts', indexTS)
	}
}
