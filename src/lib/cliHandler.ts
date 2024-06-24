export const getArgs = (): { cmd: string; args: string[] } => {
	const [cmd, ...args] = process.argv.slice(2) as [string, ...string[]]

	if (args[0]?.startsWith('./')) return { args, cmd: 'tail' }
	return { args, cmd }
}
