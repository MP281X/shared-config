#!/usr/bin/env node
import { asyncCommands, execCmd } from './task-runner/execCmd.ts'
import { findProjects } from './task-runner/findProjects.ts'
import readline from 'readline'

// handle console clear and exit
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)
process.stdin.on('keypress', (_, key: { ctrl: boolean; name: string }) => {
	if (key.ctrl && key.name === 'c') return process.exit()
	if (key.name === 'return') {
		console.log('\n'.repeat(10000))
		console.clear()
	}
})

// find all the projects
const projects = await findProjects()
const task = (process.argv[2] ?? '') as ('dev' | 'build') & ({} & string) // eslint-disable-line @typescript-eslint/ban-types

// lint/format
if (task !== 'dev') {
	// run prettier
	const prettierArgs: string[] = ['--ignore-path .gitignore', '--log-level warn', '--cache', '--check']
	await execCmd({
		title: 'prettier',
		cmd: `pnpm prettier ${prettierArgs.join(' ')} .`,
		mode: 'sync'
	})

	// run eslint
	const eslintArgs: string[] = ['--no-color', '--cache']
	await execCmd({
		title: 'eslint',
		cmd: `pnpm eslint ${eslintArgs.join(' ')} .`,
		mode: 'sync'
	})
}

for (const { name, cwd } of projects) {
	if (task === 'dev') continue

	// type check
	await execCmd({
		title: `${name}:tsc`,
		cmd: 'pnpm tsc --noEmit',
		mode: 'sync',
		cwd
	})
}

// run the scripts
for (const { name, cwd, scripts } of projects) {
	if (!scripts.includes(task)) continue

	await execCmd({
		title: `${name}:${task}`,
		cmd: `pnpm run --silent ${task}`,
		mode: 'async',
		cwd
	})
}

await Promise.all(asyncCommands).then(() => process.exit(0))
