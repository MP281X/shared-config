#!/bin/sh

# fix github actions
export TERM=xterm

# get current package manager
export PACKAGE_MANAGER=${npm_execpath:-pnpm}

# terminate script with ctrl_c
set -e
trap ctrl_c INT

# colored logs
log() {
	echo ""
	echo "\033[1;33m$1\033[0m"
	echo ""
}

# load .env
[ -f ".env" ] && export $(cat .env | xargs)

# delete files and folders
delete() {
	find . -type f -name "$1" -delete
	find . -type d -name "$1" -exec rm -rf \;
}

if [ "$EXPORT_PATH" = "true" ]; then
	CURRENT_FILE_PATH="$( cd "$( dirname "$0" )" && pwd )/+helpers.sh"
	echo "$CURRENT_FILE_PATH"
else
	clear
fi
