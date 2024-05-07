### package.json

```jsonc
{
	"type": "module",
	"pnpm": { "peerDependencyRules": { "allowedVersions": { "eslint": "*" } } },
	"devDependencies": { "@mp281x/shared-config": "latest", "@fsouza/prettierd": "latest" }
}
```

### .npmrc

```.npmrc
auto-install-peers = true

@mp281x:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${REGISTRY_TOKEN}
```

### tsconfig.json

```jsonc
{
	"extends": ["@mp281x/shared-config/tsconfig"],
	"include": ["index.ts", "src/**/*", "*.config.*", "vitest.*"],
	"exclude": ["**/node_modules", "**/.*/", "**/dist", "**/build"]
}
```

### eslint.config.js

```js
export { default } from '@mp281x/shared-config/eslint'
```

### prettier.config.js

```js
export { default } from '@mp281x/shared-config/prettier'
```

### vitest.workspace.ts

```js
export { default } from './dist/vitest.js'
```
