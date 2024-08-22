export const getArgs = (): { cmd: string; args: string[] } => {
	const [cmd, ...args] = process.argv.slice(2) as [string, ...string[]]
	const arg0 = args[0] ?? ''

	if (arg0.endsWith('.ts')) return { args, cmd: 'node' }
	if (arg0.endsWith('.js')) return { args, cmd: 'node' }
	if (arg0.endsWith('.log')) return { args, cmd: 'tail' }

	return { args, cmd }
}
