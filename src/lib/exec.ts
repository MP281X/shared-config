import { spawn } from 'node:child_process'
import fs from 'node:fs'

import { log } from './logger.ts'

export const execCmd = async (cmd: string, args: readonly string[]) => {
	const execPromise = new Promise<void>((resolve, _) => {
		const output = spawn(cmd, args, {
			env: {
				// biome-ignore lint/style/useNamingConvention: <explanation>
				FORCE_COLOR: '1',
				...process.env
			}
		})

		output.stdout.on('data', (msg: Buffer) => void log.info(msg))

		output.stderr.on('data', (msg: Buffer) => void log.error(msg))

		output.on('error', error => {
			void log.error(error.message)
			process.exit(1)
		})

		output.on('exit', exitCode => {
			if (exitCode === 0 || exitCode === null) return resolve()
			if (process.argv[2] === 'dev') return resolve()

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
