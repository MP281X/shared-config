. "$( cd "$( dirname "$0" )" && pwd )/+helpers.sh"

log "CLEAN PROJECT"
delete "dist"
delete ".next"
delete "*.g.ts"
delete "node_modules"

log "PACKAGES INSTALL"
$PACKAGE_MANAGER update --recursive --quiet --no-save
