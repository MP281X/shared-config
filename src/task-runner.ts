#!/usr/bin/env node
import { getArgs, handleKeypress } from './lib/cliHandlers.ts'
import { asyncCommands, execCmd, readLogFile } from './lib/execCmd.ts'
import { findProjects } from './lib/findProjects.ts'

handleKeypress()
const { flags, task, cmd } = getArgs()
const projects = findProjects()
const monorepo = projects.length > 1

// apply formatting and linting rules
if (flags.includes('--apply')) {
	await execCmd({
		title: 'prettier',
		cmd: ['prettier', '--ignore-path .gitignore', '--log-level warn', '--write', '.'],
		mode: 'sync'
	})

	await execCmd({
		title: 'eslint',
		cmd: ['eslint', '--no-color', '--fix', '.'],
		mode: 'sync'
	})
}

// check if all the formatting rules, linting rules and types are correct
if (flags.length === 0 || flags.includes('--check')) {
	await execCmd({
		title: 'prettier',
		cmd: ['prettier', '--ignore-path=.gitignore', '--log-level=warn', '--cache', '--check', '.'],
		mode: 'sync'
	})

	await execCmd({
		title: 'eslint',
		cmd: ['eslint', '--no-color', '--cache', '.'],
		mode: 'sync'
	})

	// type check
	for (const { name, cwd } of projects) {
		await execCmd({
			title: `${name}:tsc`,
			cmd: ['tsc', '--noEmit'],
			mode: 'sync',
			cwd
		})
	}
}

// run the tests
for (const { name } of projects) {
	if (!flags.includes('--test')) continue

	const vitestArgs = ['--reporter=json', '--disable-console-intercept', '--passWithNoTests', '--project', name]

	if (task === 'dev') await execCmd({ title: `${name}:test`, cmd: ['vitest', 'watch', ...vitestArgs], mode: 'async' })
	if (task !== 'dev') await execCmd({ title: `${name}:test`, cmd: ['vitest', 'run', ...vitestArgs], mode: 'async' })
}

// run the scripts
for (const { name, cwd, scripts, lspPlugin } of projects) {
	if (!flags.includes('--run')) continue
	if (monorepo && !scripts.includes(task)) continue

	if (monorepo) await execCmd({ title: `${name}:${task}`, cmd: ['run', '--silent', task], mode: 'async', cwd })
	else await execCmd({ title: `${name}:${task}`, cmd, mode: 'async', cwd })

	if (lspPlugin && task === 'dev') await readLogFile({ title: name, cwd })
}

await Promise.all(asyncCommands).then(() => process.exit(0))
