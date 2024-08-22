import { spawn } from 'node:child_process'
import fs from 'node:fs'

import { log, printLog } from './logger.ts'
import { packageManager } from './projectData.ts'

export const execCmd = async (cmd: string, args: readonly string[], stdio: 'pipe' | 'inherit' = 'pipe') => {
	const cmdName = cmd.split('/').pop()?.split('.').shift()
	printLog(`${cmdName} ${args.join(' ')}\n`, 'warn')

	const execPromise = new Promise<void>((resolve, _) => {
		const output = spawn(cmd, args, {
			stdio,
			env: {
				// biome-ignore lint/style/useNamingConvention: enable colors for some cli (turbopack)
				FORCE_COLOR: '1',
				// biome-ignore lint/style/useNamingConvention: disable node experimental warning (--experimental-strip-types)
				NODE_NO_WARNINGS: '1',
				...process.env
			}
		})

		output.stdout?.on('data', (msg: Buffer) => void log.info(msg))

		output.stderr?.on('data', (msg: Buffer) => void log.error(msg))

		output.on('error', error => {
			void log.error(error.message)
			process.exit(1)
		})

		output.on('exit', exitCode => {
			if (exitCode === 0 || exitCode === null) return resolve()

			void log.error(`EXIT CODE: ${exitCode}`)
			process.exit(1)
		})

		const kill = () => {
			if (output.killed) return
			output.kill()
		}

		process.on('exit', kill)
		process.on('SIGINT', kill)
		process.on('SIGTERM', kill)
		process.on('beforeExit', kill)
	})

	return await execPromise
}

export const readLogFile = async (paths: readonly string[]) => {
	// clear the log file
	for (const path of paths) {
		if (fs.existsSync(path)) fs.rmSync(path)
		fs.writeFileSync(path, '')

		await execCmd('tail', ['-f', path])
	}
}

export const nodeExec = async (args: readonly string[], stdio: 'pipe' | 'inherit' = 'inherit') => {
	await execCmd(packageManager(), args, stdio)
}
