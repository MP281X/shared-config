#!/usr/bin/env node

import fs from 'node:fs'
import { cleanProject } from './lib/cleanProject'
import { getArgs, handleKeypress } from './lib/cliHandler'
import { execCmd, nodeExec } from './lib/exec'
import { hasDockerCompose, hasPackage } from './lib/projectData'

handleKeypress()

const { args, cmd } = getArgs()

switch (cmd) {
	case '--recursive': {
		await execCmd('x', ['pnpm', '--reporter=ndjson', '--recursive', 'run', ...args], 'inherit')

		break
	}

	case 'tail': {
		const path = args[0] ?? ''

		if (fs.existsSync(path)) fs.rmSync(path)
		fs.writeFileSync(path, '')

		await execCmd('tail', ['-f', path])
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

		await nodeExec(['update', '--recursive', '--silent', '--no-save'])

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
