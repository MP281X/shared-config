import readline from 'node:readline'

export const getArgs = (): { cmd: string; args: string[] } => {
	const [cmd, ...args] = process.argv.slice(2) as [string, ...string[]]

	if (args[0]?.startsWith('./')) return { args, cmd: 'tail' }
	return { args, cmd }
}

export const handleKeypress = () => {
	if (process.stdin.isTTY) {
		// handle console clear and exit
		readline.emitKeypressEvents(process.stdin)
		process.stdin.setRawMode(true)
		process.stdin.on('keypress', (_, key: { name: string; ctrl: boolean }) => {
			if (key.ctrl && key.name === 'c') return process.exit(100)
			if (key.name === 'return') {
				console.log('\n'.repeat(10000))
				console.clear()
			}
		})
	}
}
