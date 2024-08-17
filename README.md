# @mp281x/shared-config

A shared configuration package for Biome and TypeScript.
This package enforces strict coding standards to ensure uniform code style and prevent subtle bugs.

## Features

- Strict Biome and TypeScript settings.
- Scripts for linting and cleaning the project

## Installation

To configure the package, use the following `package.json` or merge it with your current one:

```jsonc
{
	"scripts": {
		"dev": "x ...",
		"fix": "x fix",
		"check": "x check",
		"setup": "x setup"
	},
	"devDependencies": { "@mp281x/shared-config": "latest" }
}
```

## Confiuration files

Put these configs in the respective files

### tsconfig.json

```jsonc
{ "extends": ["@mp281x/shared-config/tsconfig"] }
```

### biome.json

```js
{ "extends": ["@mp281x/shared-config/biome"] }
```

### .gitignore

```ini
# svelte/next/astro files
**/.svelte-kit
**/.next
**/.astro
**/next-env.d.ts

# output
**/dist
**/build

# generated files
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
```

## CLI

This package includes a CLI for filtering and highlighting useful information from the logs of other tools.

### Usage and Example

Prepend your command with x

```json
{
	"scripts": "x vite dev"
}
```

```sh
pnpm run x vite dev
```
