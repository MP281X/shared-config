#!/usr/bin/env -S node --experimental-strip-types

import fs from 'node:fs'
import { cleanProject } from './lib/cleanProject.ts'
import { getArgs } from './lib/cliHandler.ts'
import { configProject } from './lib/configProject.ts'
import { execCmd, nodeExec } from './lib/exec.ts'
import { hasDockerCompose, hasPackage, packageManager } from './lib/projectData.ts'

const { args, cmd } = getArgs()

console.clear()

switch (cmd) {
	case 'tail': {
		const path = args[0] ?? ''

		if (fs.existsSync(path)) fs.rmSync(path)
		fs.writeFileSync(path, '')

		await execCmd('tail', ['-f', path])
		break
	}

	case 'node': {
		const path = args[0] ?? ''

		await nodeExec(['node', '--experimental-strip-types', '--watch', path])
		break
	}

	case 'fix': {
		await nodeExec(['biome', 'check', '--write', '.'])
		break
	}

	case 'check': {
		await nodeExec(['biome', 'check', '.'])

		if (hasPackage('svelte')) await nodeExec(['svelte-check', '--tsconfig', './tsconfig.json'])
		else await nodeExec(['tsc', '--noEmit'])
		break
	}

	case 'setup': {
		cleanProject()
		configProject()

		if (packageManager() === 'pnpm') nodeExec(['update', '--recursive', '--no-save'])

		if (hasPackage('svelte')) await nodeExec(['svelte-kit', 'sync'])
		if (hasPackage('@mp281x/realtime')) await nodeExec(['realtime'])
		break
	}

	case 'docker': {
		if (hasDockerCompose() === false) break

		await execCmd('docker', ['compose', 'down', '--remove-orphans'], 'inherit')
		await execCmd('docker', ['compose', 'up', '--build', '--detach', '--wait'], 'inherit')
		break
	}
	default: {
		await execCmd(cmd, args)
		break
	}
}

process.exit(0)
