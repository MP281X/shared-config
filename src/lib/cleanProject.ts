import fs from 'node:fs'
import { printLog } from './logger'

const filesToDelete = ['dist', '.next', '*.g.ts', '.svelte-kit']

export const cleanProject = (dir: string = process.cwd()) => {
	if (dir === process.cwd()) printLog('CLEAN PROJECT', 'warn')

	const paths = fs.readdirSync(dir)

	for (const path of paths) {
		try {
			if (path.includes('.git')) continue
			if (path.includes('node_modules')) continue

			const filePath = `${dir}/${path}`
			if (filesToDelete.includes(path)) fs.rmSync(filePath, { force: true, recursive: true })
			if (fs.statSync(filePath).isDirectory()) cleanProject(filePath)
		} catch {}
	}
}
