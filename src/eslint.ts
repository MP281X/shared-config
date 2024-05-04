/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// @ts-expect-error: no type definitions
import js from '@eslint/js'
import ts from 'typescript-eslint'
import type { ConfigWithExtends } from 'typescript-eslint'

// @ts-expect-error: no type definitions
import unicorn from 'eslint-plugin-unicorn'
import functional from 'eslint-plugin-functional/flat'

import svelte from 'eslint-plugin-svelte'
import eslintPluginAstro from 'eslint-plugin-astro'

// @ts-expect-error: no type definitions
import prettier from 'eslint-config-prettier'

export default ts.config(
	prettier,

	// @ts-expect-error invalid types
	...svelte.configs['flat/recommended'],
	...eslintPluginAstro.configs.recommended,

	js.configs.recommended,
	...ts.configs.strictTypeChecked,
	{ ignores: ['dist/**', 'node_modules/**', 'bin/**', 'build/**'] },
	{
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: true,
				tsconfigRootDir: process.cwd()
			}
		},
		files: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.svelte', '**/*.astro'],
		plugins: { unicorn, functional },
		rules: {
			'no-var': 'error', // disable var keyword
			'no-constant-condition': 'off', // already checked in the typescript rules
			'spaced-comment': ['error', 'always'], // space after comment
			'array-callback-return': ['error', { checkForEach: true, allowVoid: true, allowImplicit: false }], // check for return type in map, foreach, ...
			'no-restricted-syntax': ['error', 'TryStatement > FinallyClause'], // disable try-finally
			'no-promise-executor-return': 'error', // no return in custom promise
			'no-self-compare': 'error', // don't compare variable to itself
			'no-template-curly-in-string': 'error', // error if ${} it's used in a normal string (not template)
			'curly': ['error', 'multi-or-nest'], // disable {} if it can stay inline
			'eqeqeq': ['error', 'always'], // require triple =
			'grouped-accessor-pairs': ['error', 'getBeforeSet'], // require getters and setters to be near each other
			'no-array-constructor': 'error', // force consistent array of x element definitions
			'no-bitwise': 'error', // error if using | or & instead of || or &&
			'no-else-return': 'error', // disable else if the if has a return
			'no-empty': ['error', { allowEmptyCatch: true }], // no empty block (catch excluded)
			'no-extend-native': 'error', // don't add property to global object
			'no-extra-boolean-cast': ['error', { enforceForLogicalOperands: true }], // don't use more than one ! before a variable
			'no-implicit-coercion': 'error', // no implicit type conversion 1+"1" -> string
			'no-multi-assign': 'error', // disable multi assing const a = b = 1
			'no-negated-condition': 'error', // no else after negation in if. if (!var1)
			'no-plusplus': 'error', // disable ++ and --
			'no-return-assign': 'error', // no variable assignment in return
			'no-sequences': 'error', // disable multiple operation inline separated by ,
			'no-shadow': 'off', // already checked by the eslint typescript plugin
			'object-shorthand': 'error', // disable object value with the same name as the key
			'operator-assignment': 'error', // use x+=1 instead of x = x+1
			'symbol-description': 'error', // allow only sibols with description ok: Symbol("a"), err: Symbol()
			'yoda': ['error', 'never'], // variable to check before literal -> var1 === true

			// other js/ts rules from the unicorn package
			'unicorn/consistent-destructuring': 'error', // consistent deconstruct (deconstruct all or nothing)
			'unicorn/error-message': 'error', // require message when creating an error new Error("msg")
			'unicorn/new-for-builtins': 'error', // require the new keyword when necessary and removes it when is not
			'unicorn/no-for-loop': 'error', // disable for loop when it can be replaced with a for-of
			'unicorn/no-instanceof-array': 'error', // prevents bug when checking if a variable is an array
			'unicorn/no-new-array': 'error', // creare new array of x elements only with Array.from({length: lenght}) instead of new Array(100)
			'unicorn/no-null': 'error', // disable null (it works inside of triple = if)
			'unicorn/no-thenable': 'error', // disable .then
			'unicorn/prefer-string-starts-ends-with': 'error', // use "".startsWith or "".endsWith instead of regex
			'unicorn/prefer-string-trim-start-end': 'error', // use trimStart/trimEnd instead of trimLeft/trimRight

			// functional programming
			'functional/no-classes': 'error', // disable classes
			'functional/no-this-expressions': 'error', // disable this
			'func-style': ['error', 'expression', { allowArrowFunctions: true }], // allow only const a = () =>{} or const a = function a() {}
			'arrow-body-style': ['error', 'as-needed'], // don't use {} for inline return
			'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],

			// typescript
			'@typescript-eslint/array-type': 'error', // use X[] instead of Array<X>
			'@typescript-eslint/ban-types': 'error', // disable problematic types -> {}
			'@typescript-eslint/consistent-generic-constructors': 'error', // specify types on constructor instead of on the variable
			'@typescript-eslint/consistent-indexed-object-style': 'error', // use Record<string,string> instead of {[key: string]:string}
			'@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': false }], // allow only the @ts-expect-error
			'@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }], // disable as (as const still work)
			'@typescript-eslint/unbound-method': 'off', // cause errors with the typescript compiler api
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'], // disable interface
			'@typescript-eslint/consistent-type-exports': 'error', // separate type export
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // allow writing if (var1 === false) instead of only if (!var1)
			'@typescript-eslint/no-confusing-void-expression': 'off', // enable returning void -> ()=>console.log("ok")
			'@typescript-eslint/method-signature-style': 'error', // allow only arrow functions in types
			'@typescript-eslint/no-inferrable-types': 'error', // don't specify type for inferrable types
			'@typescript-eslint/no-meaningless-void-operator': 'off', // allow returning void, return void console.log("ok")
			'@typescript-eslint/no-non-null-assertion': 'off', // allow non null assestion
			'@typescript-eslint/no-require-imports': 'error', // disable require
			'@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }], // diable const condition exept for loops
			'@typescript-eslint/prefer-for-of': 'error', // use for (const x of []) instead of normal for loop
			'@typescript-eslint/prefer-function-type': 'error', // disable defining function with this { (): string } instead of ()=>string
			'@typescript-eslint/require-array-sort-compare': 'error', // require compare function as sort argument
			'@typescript-eslint/switch-exhaustiveness-check': 'error', // make switch check all cases
			'@typescript-eslint/no-unused-vars': 'off', // disable error for unused variables or params (already checked by typescript)
			'@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }], // enable using number and other
			'@typescript-eslint/no-unsafe-argument': 'off', // the rules doesn't work as expected
			'@typescript-eslint/no-shadow': 'error', // disable variable in inner scope with the same name o another variable
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'objectLiteralProperty',
					format: ['camelCase', 'snake_case', 'UPPER_CASE']
				}
			], // enforce variable naming style

			// svelte
			'svelte/infinite-reactive-loop': 'error', // prevent reactivity bug
			'svelte/no-export-load-in-svelte-module-in-kit-pages': 'error', // no function called load in script
			'svelte/no-reactive-reassign': 'error', // don't readding derived reactive values
			'svelte/no-store-async': 'error', // disable async await in stores
			'svelte/valid-prop-names-in-kit-pages': 'error', // disable invalid exports in +page.svelte file
			'svelte/block-lang': ['error', { enforceScriptPresent: true, script: ['ts'] }], // require lang="ts" in the script tag
			'svelte/no-immutable-reactive-statements': 'error', // disable reactive statement for const values
			'svelte/no-useless-mustaches': 'error', // don't allow useless {}
			'svelte/sort-attributes': 'error' // html attributes needs to be sorted
		}
	}
) as ConfigWithExtends[]
