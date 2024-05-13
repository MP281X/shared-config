import fs from 'fs'
import { spawn } from 'child_process'

import { log } from './logger.ts'

export const getPackageManager = () => {
	const currentDir = fs.readdirSync('.')

	if (currentDir.includes('bun.lockb')) return 'bun'
	if (currentDir.includes('pnpm-lock.yaml')) return 'pnpm'
	if (currentDir.includes('package-lock.json')) return 'npm'
	if (currentDir.includes('yarn.lock')) return 'yarn'

	return 'pnpm'
}

export const asyncCommands: Promise<void>[] = []

type ExecCmd = { cwd?: string; title: string; cmd: string[]; customCmd?: string; mode: 'sync' | 'async' }
export const execCmd = async ({ cmd, customCmd, cwd, mode, title }: ExecCmd) => {
	const execPromise = new Promise<void>((resolve, _) => {
		const output = spawn(customCmd ?? getPackageManager(), cmd, {
			cwd: cwd ?? process.cwd(),
			env: { ...process.env }
		})

		output.stdout.on('data', (msg: Buffer) => void log.info(title, msg))

		output.stderr.on('data', (msg: Buffer) => void log.error(title, msg))

		output.on('error', error => {
			void log.error(title, error.message)
			process.exit(1)
		})

		output.on('exit', exitCode => {
			if (exitCode === 0 || exitCode === null) return resolve()
			if (process.argv[2] === 'dev') return resolve()

			void log.error(title, `EXIT CODE: ${exitCode}`)
			process.exit(1)
		})
	})

	if (mode === 'sync') return await execPromise
	return void asyncCommands.push(execPromise)
}

type ReadLogFile = { cwd: string; title: string }
export const readLogFile = async ({ cwd, title }: ReadLogFile) => {
	// clear the log file
	const logFile = `${cwd}/lsp-plugin.log`
	if (fs.existsSync(logFile)) fs.rmSync(logFile)
	fs.writeFileSync(logFile, '')

	await execCmd({
		cmd: ['-f', logFile],
		customCmd: 'tail',
		mode: 'async',
		title: `${title}:lsp-logs`
	})
}
