import yaml from 'yaml'
import fs from 'node:fs'

// parse json/yaml/.gitignore and add the custom return type
export const parseConfig = <Res>(path: string): Res | undefined => {
	try {
		const file = fs.readFileSync(path).toString()
		let out

		if (path.endsWith('.json')) out = JSON.parse(file) as Record<string, unknown>
		if (path.endsWith('.yaml')) out = yaml.parse(file) as Record<string, unknown>

		if (path.endsWith('.gitignore')) {
			out = fs
				.readFileSync(path)
				.toString()
				.split('\n')
				.map(line => line.split('#').shift()?.trim())
				.filter(line => line !== '' && line !== undefined) as string[]
		}

		// @ts-expect-error
		return out
	} catch {}

	return undefined
}
