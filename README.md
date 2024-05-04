# tsconfig.json
```jsonc
{
	"extends": ["@mp281x/shared-config/tsconfig"],
	"include": ["index.ts", "src/**/*.ts", "*.config.*"],
	"exclude": ["**/node_modules", "**/.*/", "**/dist"]
}
```

# eslint.config.js
```js
export { default } from '@mp281x/shared-config/eslint'
```

# prettier.config.js
```js
export { default } from '@mp281x/shared-config/prettier'
```
