#!/usr/bin/env -S node --experimental-strip-types

import { cleanProject } from './lib/cleanProject.ts'
import { getArgs } from './lib/cliHandler.ts'
import { configProject } from './lib/configProject.ts'
import { cliExec, execCmd, readLogFile } from './lib/exec.ts'
import { hasDockerCompose, hasPackage, packageManager } from './lib/projectData.ts'

const { args, cmd } = getArgs()

console.clear()

switch (cmd) {
	case 'tail': {
		await readLogFile(args)
		break
	}

	case 'node': {
		await execCmd(['node', '--experimental-strip-types', '--watch', ...args], 'pipe')
		break
	}

	case 'fix': {
		await cliExec(['biome', 'check', '--write', '.'])
		break
	}

	case 'test': {
		await execCmd([
			'node',
			'--experimental-strip-types',
			...['--test-reporter', '@mp281x/shared-config/tests'],
			...['--test', '*.test.*', 'src/**/*.*', 'src/**/**/*.*', 'src/**/**/**/*.*', 'src/**/**/**/**/*.*']
		])
		break
	}

	case 'check': {
		await cliExec(['biome', 'check', '.'])

		if (hasPackage('svelte')) await cliExec(['svelte-check', '--tsconfig', './tsconfig.json'])
		else await cliExec(['tsc', '--noEmit'])
		break
	}

	case 'setup': {
		cleanProject()
		configProject()

		if (packageManager() === 'pnpm') await execCmd(['pnpm', 'update', '--recursive', '--no-save'])

		if (hasPackage('svelte')) await cliExec(['svelte-kit', 'sync'])
		if (hasPackage('@mp281x/realtime')) await cliExec(['realtime'], 'inherit')
		break
	}

	case 'build': {
		await cliExec(['tsup-node'])
		if (hasPackage('svelte')) await cliExec(['vite', 'build'])
		if (hasPackage('next')) await cliExec(['next', 'build'])

		break
	}

	case 'docker': {
		if (hasDockerCompose() === false) break

		await execCmd(['docker', 'compose', 'down', '--remove-orphans'])
		await execCmd(['docker', 'compose', 'up', '--build', '--detach', '--wait'])
		break
	}
	default: {
		await cliExec([cmd, ...args], 'pipe')
		break
	}
}

process.exit(0)
