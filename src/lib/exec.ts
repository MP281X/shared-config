import fs from 'fs'
import { spawn } from 'child_process'

import { log } from './logger.ts'

export const execCmd = async (cmd: string, args: readonly string[]) => {
	const execPromise = new Promise<void>((resolve, _) => {
		const output = spawn(cmd, args, {
			env: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				FORCE_COLOR: '1',
				...process.env
			}
		})

		output.stdout.on('data', (msg: DeepReadonly<Buffer>) => void log.info(msg))

		output.stderr.on('data', (msg: DeepReadonly<Buffer>) => void log.error(msg))

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
