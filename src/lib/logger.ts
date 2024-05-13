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
	error: logFn('error'),
	info: logFn('info')
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

// tsx
invalidLogs.push('> ', "Completed running '")

// vitest
invalidLogs.push('include: **/', 'exclude:  **/', 'No test files found', 'projects: ', '] Config', '⏳ Waiting for TypeScript to check your project')

// tsup
invalidLogs.push('CLI ', 'CJS Build start', 'CJS ⚡', 'No fixes needed.')

// format the title then pass the log to the respective formatter based on the title
const formatLog = (title: string, input: string, color: number) => {
	title = title.trim()
	if (title.length < 15) title += ' '.repeat(15 - title.length)

	const printLog = (txt: string) => console.log(`\x1b[${color}m${title} ➜ \x1b[0m${txt}`)

	try {
		if (input.trim().startsWith('{') && title.trim().endsWith(':test')) return vitestLogFormatter(input, printLog)
		if (title.trim().endsWith(':test')) return defaultLogFormatter(input, printLog, 'log')
		return defaultLogFormatter(input, printLog)
	} catch {}
}

// given a log string split it for every line and print the message
const defaultLogFormatter = (input: string, printLog: (txt: string) => void, prefix?: string) => {
	logLines: for (let txt of input.split('\n')) {
		if (txt.trim() === '') continue

		for (const invalidLog of invalidLogs) if (txt.trim().includes(invalidLog)) continue logLines

		if (txt.includes('./index.js')) txt = txt.slice(2)
		if (txt.includes('file truncated')) txt = 'FILE CLEARED'

		if (txt.startsWith('  ➜  Local:   ')) txt = txt.replace('  ➜  Local:   ', '')
		if (txt.startsWith('  ➜  Network: ')) txt = txt.replace('  ➜  Network: ', '')

		if (txt.startsWith("Restarting '")) txt = 'RESTART'

		if (prefix) printLog(`[${prefix}] ${txt}`)
		else printLog(txt)
	}
}

// given the json output of vitest extract the errors and pass them to the default formatter
const vitestLogFormatter = (input: string, printLog: (txt: string) => void) => {
	let hasLogged = false

	for (const { errors, name } of parseVitestOutput(input)) {
		for (let error of errors) {
			hasLogged = true

			error = error.replaceAll('❌TypeScript@typescript:AssertionError [ERR_ASSERTION]: ', '')
			printLog(`${name} ${error}`)
		}
	}

	if (hasLogged) printLog('\x1b[91m[info] SOME TESTS FAILED\x1b[0m')
	else printLog('\x1b[92m[info] ALL TESTS PASSED\x1b[0m')
}

const parseVitestOutput = (input: string): { name: string; errors: string[] }[] => {
	type VitestJSON = {
		testResults: [
			{
				name: string
				status: 'passed' | 'failed'
				assertionResults: [{ title: string; failureMessages: string[]; status: 'passed' | 'failed' }]
			}
		]
		success: boolean
	}
	const vitestData = JSON.parse(input) as VitestJSON
	if (vitestData.success) return []
	return vitestData.testResults.flatMap(testFile => {
		const filePath = testFile.name.replace(process.cwd(), '').split('/').slice(3).join('/')

		return testFile.assertionResults
			.filter(test => test.status === 'failed')
			.map(test => ({
				name: `\x1b[91m[${filePath} -> "${test.title}"]\x1b[0m`,
				// split on lines and on new error
				errors: test.failureMessages
					.join('\n')
					.split('\n')
					.filter(logMsg => logMsg.trim() !== '')
			}))
	})
}
