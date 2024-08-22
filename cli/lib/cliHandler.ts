export const getArgs = (): { cmd: string; args: string[] } => {
	const [cmd, ...args] = process.argv.slice(2) as [string, ...string[]]

	if (cmd.endsWith('.ts')) return { args: [cmd], cmd: 'node' }
	if (cmd.endsWith('.js')) return { args: [cmd], cmd: 'node' }
	if (cmd.endsWith('.log')) return { args: [cmd], cmd: 'tail' }

	return { args, cmd }
}
