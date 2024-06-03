# @mp281x/shared-config

A shared configuration package for ESLint, Prettier, and TypeScript.
This package enforces strict coding standards to ensure uniform code style and prevent subtle bugs.

## Features

- Strict ESLint, Prettier, and TypeScript settings.
- Scripts for linting and cleaning the project

## Installation

To configure the package, use the following `package.json` or merge it with your current one:

```jsonc
{
	"type": "module",
	"scripts": {
		"dev": "x ...",
		"fix": "shared-config-fix",
		"lint": "shared-config-lint",
		"setup": "shared-config-setup"
	},
	"devDependencies": { "@mp281x/shared-config": "latest" },
	"pnpm": { "peerDependencyRules": { "allowedVersions": { "eslint": "*" } } }
}
```

## Confiuration files

Put these configs in the respective files

### tsconfig.json

```jsonc
{
	"extends": ["@mp281x/shared-config/tsconfig"],
	"include": ["index.ts", "src/**/*", "*.config.*"],
	"exclude": ["**/node_modules", "**/.*/", "**/dist"]
}
```

### eslint.config.js

```js
export { default } from '@mp281x/shared-config/eslint'
```

### prettier.config.js

```js
export { default } from '@mp281x/shared-config/prettier'
```

### .gitignore

```ini
# svelte/next files
**/build
**/.svelte-kit
**/.next
**/next-env.d.ts

# generated files
**/*.g.ts
**/.eslintcache
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
	"scripts": "x next dev --turbo"
}
```

```sh
pnpm run x next dev --turbo
```
