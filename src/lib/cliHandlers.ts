import readline from 'readline'

export const getArgs = () => {
	const args: string[] = process.argv.slice(2)

	const flags: string[] = []
	const cmd: string[] = []

	while (args[0]?.startsWith('--')) flags.push(args.shift()!)

	cmd.push(...args)

	return { flags, task: args[0]!, cmd: args }
}

export const handleKeypress = () => {
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
}
