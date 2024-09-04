import fs from 'node:fs'
import { hasPackage } from './projectData.ts'

const tsconfig = `
{ "extends": ["@mp281x/shared-config/tsconfig"] }
`.trimStart()

const svelteTsConfig = `
{ "extends": ["./.svelte-kit/tsconfig.json", "@mp281x/shared-config/tsconfig"] }
`.trimStart()

const nextTsConfig = `
{
	"extends": ["@mp281x/shared-config/tsconfig"],
	"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
	"compilerOptions": { "plugins": [{ "name": "next" }], "paths": { "@/*": ["./*"] } }
}
`.trimStart()

const nextJSConfig = `
/** @type {import('next').NextConfig} */
export default {
	eslint: { ignoreDuringBuilds: true },
	typescript: { ignoreBuildErrors: true }
}
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

export const configProject = () => {
	fs.writeFileSync('tsconfig.json', tsconfig)
	fs.writeFileSync('biome.jsonc', biome)
	fs.writeFileSync('.gitignore', gitignore)

	if (hasPackage('next')) fs.writeFileSync('tsconfig.json', nextTsConfig)
	if (hasPackage('next')) fs.writeFileSync('next.config.mjs', nextJSConfig)
	if (hasPackage('svelte')) fs.writeFileSync('tsconfig.json', svelteTsConfig)
}
