import type { ReadableStream } from 'node:stream/web'

const invalidLogs: string[] = []

// vite
invalidLogs.push(
	'✔',
	'✨',
	'VITE',
	'vinxi ',
	'hmr for .svelte',
	'vite-plugin-svelte',
	'Re-optimizing dependencies',
	'➜  Network: use --host to expose',
	'Forced re-optimization of dependencies',
	'Re-optimizing dependencies because lockfile has changed'
)

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

// nextjs
invalidLogs.push(
	' 200 in ',
	'▲ Next.js',
	'✓ Ready in',
	'Compiling /',
	'- Experiments',
	'✓ Starting...',
	'· reactCompiler',
	'[BABEL] Note: The code generator'
)

// tsx/pnpm
invalidLogs.push('> ', "Completed running '", ' workspace projects')

const strIncludes = (str: string, includes: string[]) => {
	for (const include of includes) if (str.includes(include)) return true

	return false
}

const formatLog = (input: string, type: LogType) => {
	for (const rawTxt of input.split('\n')) {
		// biome-ignore lint/suspicious/noControlCharactersInRegex:
		let txt = rawTxt.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '')

		if (txt.trim() === '') continue
		if (strIncludes(txt, invalidLogs)) continue
		if (/^\w+ \w+\$ .+$/.test(txt)) continue

		if (strIncludes(txt, ['file truncated'])) {
			printLog('FILE CLEARED', 'warn')
			continue
		}

		if (strIncludes(txt, ['➜  Local:', '➜  Network:', '- Local:', '┃ Local'])) {
			txt = txt.replace('➜  Local:', '')
			txt = txt.replace('➜  Network:', '')
			txt = txt.replace('- Local:', '')
			txt = txt.replace('┃ Local', '')

			printLog(txt.trim(), 'warn')
			continue
		}

		if (strIncludes(txt, ['✓ Compiled', 'hmr update', 'page reload'])) {
			txt = txt.split(' ').filter(x => x.trim().includes('/'))[0] ?? ''
			txt = txt.replaceAll(',', '')

			printLog(`UPDATED ${txt.trim()}`, 'warn')
			continue
		}

		if (txt.includes("Restarting '")) {
			printLog('RESTART', 'warn')
			continue
		}

		printLog(rawTxt, type)
	}
}

export const printLog = (txt: string, type: LogType) => {
	// biome-ignore format:
	switch (type) {
		case 'info':  return console.log(txt)
		case 'warn':  return console.log(`\x1b[${93}m${txt}\x1b[${0}m`)
		case 'error': return console.log(`\x1b[${91}m${txt}\x1b[${0}m`)
	}
}

// transform the input type to a string and pass it for the "formatLog" function
type LogFormats = string | Uint8Array | ReadableStream<Uint8Array>
const logFn = (type: LogType) => async (input: LogFormats) => {
	if (typeof input === 'string') return formatLog(input, type)
	if (input instanceof Uint8Array) return formatLog(new TextDecoder().decode(input), type)

	for await (const chunk of input) formatLog(new TextDecoder().decode(chunk), type)
}

type LogType = 'info' | 'warn' | 'error'
export const log = {
	info: logFn('info'),
	warn: logFn('warn'),
	error: logFn('error')
} satisfies Record<LogType, ReturnType<typeof logFn>>