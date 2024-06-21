#!/bin/sh

. "$( cd "$( dirname "$0" )" && pwd )/+helpers.sh"

log "BIOME"
$PACKAGE_MANAGER biome check --write .

