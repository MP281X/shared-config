import fs from 'node:fs'

import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

type EsbuildPluginHandler = NonNullable<Options['esbuildPlugins']>[number]['setup']
const changeShebang: EsbuildPluginHandler = build =>
	build.onEnd(result => {
		const textDecoder = new TextDecoder()
		const outputFiles = result.outputFiles ?? []

		const getFirstLine = (data: Uint8Array) => {
			const newLineIndex = data.indexOf(0x0a)
			if (newLineIndex === -1 || newLineIndex > 200) return ''

			return textDecoder.decode(data.slice(0, newLineIndex))
		}

		for (const file of outputFiles) {
			if (file.contents.length === 0) continue

			const firstLine = getFirstLine(file.contents)
			if (firstLine.startsWith('#!/usr/bin/env -S node') === false) continue

			const fileText = textDecoder.decode(file.contents)
			const fileWithoutShebang = fileText.slice(firstLine.length + 1, fileText.length)

			const shebang = '#!/usr/bin/env node'
			const fileWithShebang = shebang + '\n' + fileWithoutShebang

			fs.writeFileSync(file.path, fileWithShebang)
		}
	})

export const tsupConfig = (entryPoints: string[]) =>
	defineConfig({
		entryPoints,
		format: ['esm'],
		esbuildPlugins: [{ name: 'changeShebang', setup: changeShebang }],

		dts: true,
		shims: true,
		treeshake: true,
		splitting: false,
		minify: true,

		clean: true,
		silent: true,
		onSuccess: async () => console.log('\x1b[36m%s\x1b[0m', '⚡ Build success')
	})
