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
  "name": "projectName",
	"type": "module",

	"scripts": {
        "dev": "x index.ts",

		"fix": "x fix",
        "test": "x test",
		"check": "x check",
		"setup": "x setup"
	},

	"devDependencies": { "@mp281x/shared-config": "latest" }
}
```
Install the packages and run the setup script

```sh
pnpm i && pnpm run setup
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
