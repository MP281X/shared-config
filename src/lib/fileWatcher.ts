import chokidar from 'chokidar'

import { parseConfig } from './parseConfig'

export const fileWatcher = (cwd: string, onChange: (path: string) => void) =>
	chokidar.watch('.', { cwd, ignoreInitial: true, ignored: parseConfig<string[]>('.gitignore') ?? [] }).on('all', (event, path) => {
		if (event === 'change') return

		onChange(path)
	})
