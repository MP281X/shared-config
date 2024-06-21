import fs from 'node:fs'
import { printLog } from './logger'

const filesToDelete = ['dist', '.next', '*.g.ts', 'node_modules', '.svelte-kit']

export const cleanProject = (dir: string = process.cwd()) => {
	if (dir === process.cwd()) printLog('CLEAN PROJECT', 'warn')

	const paths = fs.readdirSync(dir)

	for (const path of paths) {
		try {
			if (path.includes('.git')) continue

			if (filesToDelete.includes(path)) fs.rmSync(path, { force: true, recursive: true })

			if (fs.statSync(`${dir}/${path}`).isDirectory()) cleanProject(`${dir}/${path}`)
		} catch {}
	}
}
