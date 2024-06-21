#!/usr/bin/env node

import { getArgs, handleKeypress } from './lib/cliHandler'
import { execCmd, readLogFile } from './lib/exec'

handleKeypress()

const { args, cmd } = getArgs()

if (cmd === 'tail') await readLogFile(args)
else execCmd(cmd, args)

process.exit(0)
