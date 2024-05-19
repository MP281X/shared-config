#!/usr/bin/env node

import { execCmd, readLogFile } from './lib/exec'
import { getArgs, handleKeypress } from './lib/cliHandler'

handleKeypress()

const { args, cmd } = getArgs()

// prettier-ignore
switch(cmd) {
	case "tail": await readLogFile(args); break
	default: await execCmd(cmd, args); break
}
