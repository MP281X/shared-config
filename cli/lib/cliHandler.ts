export const getArgs = (): { cmd: string; args: string[] } => {
	const [cmd, ...args] = process.argv.slice(2) as [string, ...string[]]

	if (args[0]?.startsWith('./')) {
		if (args[0].endsWith('ts')) return { args, cmd: 'node' }
		if (args[0].endsWith('js')) return { args, cmd: 'node' }

		return { args, cmd: 'tail' }
	}

	return { args, cmd }
}
