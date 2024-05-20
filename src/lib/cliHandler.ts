import readline from 'readline'

export const getArgs = (): { cmd: string; args: string[] } => {
	const args = process.argv.slice(2)
	const cmd = process.env['npm_execpath'] ?? 'pnpm'

	if (args[0]?.startsWith('./')) return { args, cmd: 'tail' }
	return { args, cmd }
}

export const handleKeypress = () => {
	if (process.stdin.isTTY) {
		// handle console clear and exit
		readline.emitKeypressEvents(process.stdin)
		process.stdin.setRawMode(true)
		process.stdin.on('keypress', (_, key: { name: string; ctrl: boolean }) => {
			if (key.ctrl && key.name === 'c') return process.exit()
			if (key.name === 'return') {
				console.log('\n'.repeat(10000))
				console.clear()
			}
		})
	}
}
