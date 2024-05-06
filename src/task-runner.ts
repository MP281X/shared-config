#!/usr/bin/env node
import { asyncCommands, execCmd } from './lib/execCmd.ts'
import readline from 'readline'

if (process.stdin.isTTY) {
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
}

const task = process.argv[2] as undefined | 'apply' | (string & {}) // eslint-disable-line @typescript-eslint/ban-types

// apply formatting and linting rules
if (task === 'apply') {
	await execCmd({
		title: 'prettier',
		cmd: 'prettier --ignore-path .gitignore --log-level warn --write .',
		mode: 'sync'
	})

	await execCmd({
		title: 'eslint',
		cmd: 'eslint --no-color --fix .',
		mode: 'sync'
	})

	process.exit(0)
}

// check if all the formatting rules, linting rules and types are correct
if (task === undefined) {
	await execCmd({
		title: 'prettier',
		cmd: 'prettier --ignore-path .gitignore --log-level warn --cache --check .',
		mode: 'sync'
	})

	await execCmd({
		title: 'eslint',
		cmd: 'eslint --no-color --cache .',
		mode: 'sync'
	})

	// type check
	await execCmd({
		title: 'tsc',
		cmd: 'tsc --noEmit',
		mode: 'sync'
	})

	process.exit(0)
}

// execute a cmd
await execCmd({
	title: 'cmd',
	cmd: task,
	mode: 'async',
	customCmd: true
})

await Promise.all(asyncCommands).then(() => process.exit(0))
