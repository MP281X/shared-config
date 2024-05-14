#!/usr/bin/env node
import { fileWatcher } from './lib/fileWatcher.ts'
import { findProjects } from './lib/findProjects.ts'
import { genGlobImportsFile } from './lib/globImports.ts'
import { getArgs, handleKeypress } from './lib/cliHandlers.ts'
import { execCmd, readLogFile, asyncCommands } from './lib/execCmd.ts'

handleKeypress()
const { cmd, flags, task } = getArgs()
const projects = findProjects()

const isMonorepo = projects.length > 1

// codegen
for (const { cwd, globImports } of projects) {
	if (globImports.length === 0) continue

	genGlobImportsFile(globImports, cwd)
	if (flags.includes('--run')) fileWatcher(cwd, () => genGlobImportsFile(globImports, cwd))
}

// apply formatting and linting rules
if (flags.includes('--fix')) {
	await execCmd({
		cmd: ['prettier', '--ignore-path=.gitignore', '--log-level=warn', '--write', '.'],
		mode: 'sync',
		title: 'prettier'
	})

	await execCmd({
		cmd: ['eslint', '--no-color', '--fix', '.'],
		mode: 'sync',
		title: 'eslint'
	})
}

// check if all the formatting rules, linting rules and types are correct
if (flags.length === 0 || flags.includes('--check')) {
	await execCmd({
		cmd: ['prettier', '--ignore-path=.gitignore', '--log-level=warn', '--cache', '--check', '.'],
		mode: 'sync',
		title: 'prettier'
	})

	await execCmd({
		cmd: ['eslint', '--no-color', '--fix', '.'],
		mode: 'sync',
		title: 'eslint'
	})

	// type check
	for (const { cwd, name, type } of projects) {
		if (type === 'svelte') {
			await execCmd({
				cmd: ['svelte-kit', 'sync'],
				cwd,
				mode: 'sync',
				title: `svelte-sync:${name}`
			})

			await execCmd({
				cmd: ['svelte-check', '--output=human', '--tsconfig=./tsconfig.json'],
				cwd,
				mode: 'sync',
				title: `svelte-check:${name}`
			})
		}

		if (type === 'node') {
			await execCmd({
				cmd: ['tsc', '--noEmit'],
				cwd,
				mode: 'sync',
				title: `${name}:tsc`
			})
		}
	}
}

// run the tests
for (const { name } of projects) {
	if (!flags.includes('--test')) continue

	const vitestArgs = ['--reporter=json', '--disable-console-intercept', '--passWithNoTests', '--project', name]

	if (flags.includes('--dev')) await execCmd({ cmd: ['vitest', 'watch', ...vitestArgs], mode: 'async', title: `${name}:test` })
	else await execCmd({ cmd: ['vitest', 'run', ...vitestArgs], mode: 'async', title: `${name}:test` })
}

// run the scripts
for (const { cwd, name, scripts } of projects) {
	if (!flags.includes('--run')) continue
	if (isMonorepo && !scripts.includes(task)) continue

	if (isMonorepo) await execCmd({ cmd: ['run', '--silent', task], cwd, mode: 'async', title: `${name}:${task}` })
	else await execCmd({ cmd, cwd, mode: 'async', title: `${name}:${task}` })
}

// read the log file of the lsp-plugin
for (const { cwd, lspPlugins, name } of projects) {
	if (!flags.includes('--dev')) continue
	if (!lspPlugins.includes('lsp-plugin')) continue

	await readLogFile({ cwd, title: name })
}

await Promise.all(asyncCommands).then(() => process.exit(0))
