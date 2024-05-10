import readline from 'readline'

export const getArgs = () => {
	const args: string[] = process.argv.slice(2)

	const flags: string[] = []
	while (args[0]?.startsWith('--')) flags.push(args.shift()!)

	const task = args[0]!
	if (flags.includes('--dev')) flags.push('--run')
	if (task === 'dev') flags.push('--dev')

	return { flags, task, cmd: args }
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
