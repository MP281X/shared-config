. "$( cd "$( dirname "$0" )" && pwd )/+helpers.sh"

log "PRETTIER"
$PACKAGE_MANAGER prettier --ignore-path=.gitignore --log-level=warn --cache --check .;

log "ESLINT"
$PACKAGE_MANAGER eslint .;

log "TYPESCRIPT"
$PACKAGE_MANAGER tsc --noEmit;
