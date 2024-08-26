import type { Test } from './parseReport.ts'

export function formatReport(tests: Test[]) {
	function logColor(txt: string, type: 'success' | 'error' | 'warning' | 'info') {
		// biome-ignore format:
		switch (type) {
			case 'info':    return `\x1b[${90}m${txt}\x1b[${0}m`
			case "success": return `\x1b[${92}m${txt}\x1b[${0}m`
			case 'warning': return `\x1b[${93}m${txt}\x1b[${0}m`
			case 'error': 	return `\x1b[${91}m${txt}\x1b[${0}m`
		}
	}

	function testResultIcon(result: Test['result']) {
		// biome-ignore format:
		switch (result) {
			case 'pass': return logColor('✓', "success")
			case 'fail': return logColor('✗', "error")
			case 'skip': return logColor('-', "warning")
			case 'todo': return logColor('☐', "warning")
		}
	}

	const fullReport: string[] = []

	for (const test of tests) {
		const icon = testResultIcon(test.result)
		const testName = logColor('|> ', 'info') + test.name.replaceAll('.', logColor(' |> ', 'info'))
		const testIdentifier = ` [${icon}] [${test.file}] ${testName}`

		const formattedLogs = test.logs
			.map(log => log.split('\n').join('\n        '))
			.map(log => `     ${logColor('|>', 'info')} ${log}`)
			.join('\n')

		const formattedError = test.error?.message
			.split('\n')
			.map(log => `        ${log}`)
			.join('\n')
			.trim()
			.replace('', `     ${logColor('|>', 'error')} `)

		const testReport = [testIdentifier, formattedLogs, formattedError].filter(x => x && x.trim() !== '').join('\n\n')
		fullReport.push(testReport + '\n\n')
	}

	return fullReport
}
