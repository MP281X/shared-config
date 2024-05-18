### package.json

```jsonc
{
	"type": "module",
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
