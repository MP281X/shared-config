import { log } from './logger.ts'
import { spawn } from 'child_process'

export const asyncCommands: Promise<void>[] = []

type ExecCmd = { title: string; cmd: string; mode: 'sync' | 'async'; cwd?: string }
export const execCmd = async ({ title, cmd, cwd, mode }: ExecCmd) => {
	const execPromise = new Promise<void>((resolve, _) => {
		const [command, ...args] = cmd.split(' ') as [string, ...string[]]
		const output = spawn(command, args, {
			cwd: cwd ?? process.cwd(),
			env: {
				...process.env
			} as NodeJS.ProcessEnv
		})

		output.stdout.on('data', (msg: Buffer) => void log.info(title, msg))

		output.stderr.on('data', (msg: Buffer) => void log.error(title, msg))

		output.on('exit', (exitCode) => {
			if (exitCode === 0 || exitCode === null) return resolve()
			if (process.argv[2] === 'dev') return resolve()

			void log.error(title, `EXIT CODE: ${exitCode}`)
			process.exit(1)
		})
	})

	if (mode === 'sync') return await execPromise
	return void asyncCommands.push(execPromise)
}
