import type { ReadableStream } from 'stream/web'

// transform the input type to a string and pass it for the "formatLog" function
type Input = string | Uint8Array | ReadableStream<Uint8Array>
const logFn = (type: LogType) => async (title: string, input: Input) => {
	const color = taskColor(title, type)

	if (typeof input === 'string') return formatLog(title, input, color)
	if (input instanceof Uint8Array) return formatLog(title, new TextDecoder().decode(input), color)
	for await (const chunk of input) formatLog(title, new TextDecoder().decode(chunk), color)
}

export const log = {
	info: logFn('info'),
	error: logFn('error')
}

// give a task the same color for the process duration
const colors: Record<string, number> = {}
type LogType = 'info' | 'error'
const taskColor = (task: string, type: LogType) => {
	if (type === 'error' && !task.includes('test:')) return 91
	if (task in colors) return colors[task] ?? 0

	const lastColor = Math.max(...Object.values(colors), 91)
	colors[task] = lastColor >= 96 ? 92 : lastColor + 1

	return colors[task] ?? 0
}

// svelte / others
const invalidLogs: string[] = [
	'svelte-check',
	'enableSourcemap',
	'svelte-inspector',
	'work in progress:',
	'Code style issues',
	'Run npm run preview',
	'> Using svelte-adapter-bun',
	'===================================='
]

// vite
invalidLogs.push(
	'✔',
	'✨',
	'VITE',
	'➜  Local:',
	'hmr for .svelte',
	'[vite] page reload',
	'vite-plugin-svelte',
	'Re-optimizing dependencies',
	'➜  Network: use --host to expose',
	'Forced re-optimization of dependencies',
	'Re-optimizing dependencies because lockfile has changed'
)

// tsup
invalidLogs.push('CLI ', 'CJS Build start', 'CJS ⚡', 'No fixes needed.')

// format the title then pass the log to the respective formatter based on the title
const formatLog = (title: string, input: string, color: number) => {
	title = title.trim()
	if (title.length < 15) title += ' '.repeat(15 - title.length)

	const printLog = (txt: string) => console.log(`\x1b[${color}m${title} ➜ \x1b[0m${txt}`)

	logLines: for (let txt of input.split('\n')) {
		if (txt.trim() === '') continue

		for (const invalidLog of invalidLogs) if (txt.trim().includes(invalidLog)) continue logLines

		if (txt.includes('./index.js')) txt = txt.slice(2)
		if (txt.includes('file truncated')) txt = 'FILE CLEARED'

		printLog(txt)
	}
}
