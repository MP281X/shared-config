### package.json

```jsonc
{
	"type": "module",
	"scripts": {
		"fix": "shared-config-fix",
		"lint": "shared-config-lint",
		"setup": "shared-config-setup"
	},
	"devDependencies": { "@mp281x/shared-config": "latest" },
	"pnpm": { "peerDependencyRules": { "allowedVersions": { "eslint": "*" } } }
}
```

### tsconfig.json

```jsonc
{
	"extends": ["@mp281x/shared-config/tsconfig"],
	"include": ["index.ts", "src/**/*", "*.config.*"],
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

### index.ts, layout.tsx, ...

```js
import type {} from '@mp281x/shared-config/types'
```
