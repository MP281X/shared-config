import { log } from './logger.ts'
import { spawn } from 'child_process'
import fs from 'fs'

export const getPackageManager = () => {
	const currentDir = fs.readdirSync('.')

	if (currentDir.includes('bun.lockb')) return 'bun'
	if (currentDir.includes('pnpm-lock.yaml')) return 'pnpm'
	if (currentDir.includes('package-lock.json')) return 'npm'
	if (currentDir.includes('yarn.lock')) return 'yarn'

	return 'pnpm'
}

export const asyncCommands: Promise<void>[] = []

type ExecCmd = { title: string; cmd: string; mode: 'sync' | 'async'; cwd?: string }
export const execCmd = async ({ title, cmd, cwd, mode }: ExecCmd) => {
	const execPromise = new Promise<void>((resolve, _) => {
		const output = spawn(getPackageManager(), cmd.split(' '), {
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
