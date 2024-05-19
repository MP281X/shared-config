/* eslint-disable @typescript-eslint/no-useless-template-literals */

import type { ReadableStream } from 'stream/web'

const invalidLogs: string[] = []

// svelte
invalidLogs.push(
	'svelte-check',
	'enableSourcemap',
	'svelte-inspector',
	'work in progress:',
	'Code style issues',
	'Run npm run preview',
	'> Using svelte-adapter-bun',
	'===================================='
)

// vite
invalidLogs.push(
	'✔',
	'✨',
	'VITE',
	'hmr for .svelte',
	'[vite] page reload',
	'vite-plugin-svelte',
	'Re-optimizing dependencies',
	'➜  Network: use --host to expose',
	'Forced re-optimization of dependencies',
	'Re-optimizing dependencies because lockfile has changed'
)

// nextjs
invalidLogs.push('▲ Next.js', '- Experiments', '· reactCompiler', '[BABEL] Note:')

// tsx
invalidLogs.push('> ', "Completed running '")

const formatLog = (input: string, type: LogType) => {
	for (const txt of input.split('\n')) {
		if (txt.trim() === '') continue

		for (const invalidLog of invalidLogs) if (txt.trim().includes(invalidLog)) continue

		if (txt.includes('file truncated')) {
			printLog('FILE CLEARED', 'warn')
			continue
		}

		if (txt.startsWith('  ➜  Local:   ') || txt.startsWith('  ➜  Network: ') || txt.startsWith('  - Local:        ')) {
			txt.replace('  ➜  Local:   ', '')
			txt.replace('  ➜  Network: ', '')
			txt.replace('  - Local:        ', '')

			printLog(txt, 'warn')
			continue
		}

		if (txt.startsWith("Restarting '")) {
			printLog('RESTART', 'warn')
			continue
		}

		printLog(txt, type)
	}
}

const printLog = (txt: string, type: LogType) => {
	// prettier-ignore
	switch (type) {
		case 'info': return console.log(`\x1b[${0}m${txt}\x1b[${0}m`)
		case 'warn': return console.log(`\x1b[${93}m${txt}\x1b[${0}m`)
		case 'error': return console.log(`\x1b[${91}m${txt}\x1b[${0}m`)
	}
}

// transform the input type to a string and pass it for the "formatLog" function
type Input = string | Uint8Array | ReadableStream<Uint8Array>
const logFn = (type: LogType) => async (input: Input) => {
	if (typeof input === 'string') return formatLog(input, type)
	if (input instanceof Uint8Array) return formatLog(new TextDecoder().decode(input), type)
	for await (const chunk of input) formatLog(new TextDecoder().decode(chunk), type)
}

type LogType = 'info' | 'warn' | 'error'
export const log = {
	error: logFn('error'),
	info: logFn('info'),
	warn: logFn('warn')
} satisfies Record<LogType, ReturnType<typeof logFn>>
