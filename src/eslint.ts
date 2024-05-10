/* eslint-disable perfectionist/sort-imports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// @ts-expect-error: no type definitions
import eslint from '@eslint/js'
import ts from 'typescript-eslint'
import type { ConfigWithExtends } from 'typescript-eslint'

// @ts-expect-error: no type definitions
import prettier from 'eslint-config-prettier'
// @ts-expect-error: no type definitions
import unicorn from 'eslint-plugin-unicorn'
// @ts-expect-error: no type definitions
import perfectionist from 'eslint-plugin-perfectionist'

import svelte from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'

import { parseConfig } from './lib/parseConfig'

export default ts.config(
	{ ignores: parseConfig<string[]>('.gitignore') ?? [] },
	// typescript
	{
		extends: [...ts.configs.strictTypeChecked],
		files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.svelte'],
		rules: {
			'@typescript-eslint/ban-types': 'error', // disable problematic types -> {}
			'@typescript-eslint/no-shadow': 'error', // disable variable in inner scope with the same name o another variable
			'@typescript-eslint/array-type': 'error', // use X[] instead of Array<X>
			'@typescript-eslint/no-unused-vars': 'off', // disable error for unused variables or params (already checked by typescript)
			'@typescript-eslint/unbound-method': 'off', // cause errors with the typescript compiler api
			'@typescript-eslint/prefer-for-of': 'error', // use for (const x of []) instead of normal for loop
			'@typescript-eslint/no-unsafe-argument': 'off', // the rules doesn't work as expected
			'@typescript-eslint/no-require-imports': 'error', // disable require
			'@typescript-eslint/no-inferrable-types': 'error', // don't specify type for inferrable types
			'@typescript-eslint/no-non-null-assertion': 'off', // allow non null assestion
			'@typescript-eslint/prefer-function-type': 'error', // disable defining function with this { (): string } instead of ()=>string
			'@typescript-eslint/method-signature-style': 'error', // allow only arrow functions in types
			'@typescript-eslint/consistent-type-exports': 'error', // separate type export
			'@typescript-eslint/no-confusing-void-expression': 'off', // enable returning void -> ()=>console.log("ok")
			'@typescript-eslint/no-meaningless-void-operator': 'off', // allow returning void, return void console.log("ok")
			'@typescript-eslint/require-array-sort-compare': 'error', // require compare function as sort argument
			'@typescript-eslint/switch-exhaustiveness-check': 'error', // make switch check all cases
			'@typescript-eslint/consistent-generic-constructors': 'error', // specify types on constructor instead of on the variable
			'@typescript-eslint/consistent-indexed-object-style': 'error', // use Record<string,string> instead of {[key: string]:string}
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // allow writing if (var1 === false) instead of only if (!var1)
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'], // disable interface
			'@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': false }], // allow only the @ts-expect-error
			'@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }], // disable as (as const still work)
			'@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }], // enable using number and other
			'@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }], // diable const condition exept for loops

			// enforce variable naming style
			'@typescript-eslint/naming-convention': ['error', { selector: 'objectLiteralProperty', format: ['camelCase', 'snake_case', 'UPPER_CASE'] }]
		}
	},
	// js/ts
	{
		plugins: { unicorn, perfectionist },
		extends: [prettier, eslint.configs.recommended],
		files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.svelte'],
		rules: {
			'no-undef': 'off', // already checked by typescript
			'no-var': 'error', // disable var keyword
			'no-shadow': 'off', // already checked by the eslint typescript plugin
			'no-bitwise': 'error', // error if using | or & instead of || or &&
			'no-redeclare': 'off', // already checked by typescript
			'no-plusplus': 'error', // disable ++ and --
			'no-sequences': 'error', // disable multiple operation inline separated by ,
			'no-unused-vars': 'off', // already checked by typescript
			'no-else-return': 'error', // disable else if the if has a return
			'no-multi-assign': 'error', // disable multi assing const a = b = 1
			'no-self-compare': 'error', // don't compare variable to itself
			'yoda': ['error', 'never'], // variable to check before literal -> var1 === true
			'no-extend-native': 'error', // don't add property to global object
			'no-return-assign': 'error', // no variable assignment in return
			'object-shorthand': 'error', // disable object value with the same name as the key
			'eqeqeq': ['error', 'always'], // require triple =
			'symbol-description': 'error', // allow only sibols with description ok: Symbol("a"), err: Symbol()
			'no-constant-condition': 'off', // already checked by typescript
			'operator-assignment': 'error', // use x+=1 instead of x = x+1
			'no-array-constructor': 'error', // force consistent array of x element definitions
			'no-implicit-coercion': 'error', // no implicit type conversion 1+"1" -> string
			'no-negated-condition': 'error', // no else after negation in if. if (!var1)
			'curly': ['error', 'multi-or-nest'], // disable {} if it can stay inline
			'no-promise-executor-return': 'error', // no return in custom promise
			'spaced-comment': ['error', 'always'], // space after comment
			'no-template-curly-in-string': 'error', // error if ${} it's used in a normal string (not template)
			'arrow-body-style': ['error', 'as-needed'], // don't use {} for inline return
			'no-empty': ['error', { allowEmptyCatch: true }], // no empty block (catch excluded)
			'grouped-accessor-pairs': ['error', 'getBeforeSet'], // require getters and setters to be near each other
			'no-restricted-syntax': ['error', 'TryStatement > FinallyClause'], // disable try-finally
			'prefer-arrow-callback': ['error', { allowNamedFunctions: true }], // allow only arrow functions in callback
			'func-style': ['error', 'expression', { allowArrowFunctions: true }], // allow only const a = () =>{} or const a = function a() {}
			'no-extra-boolean-cast': ['error', { enforceForLogicalOperands: true }], // don't use more than one ! before a variable
			'array-callback-return': ['error', { allowVoid: true, checkForEach: true, allowImplicit: false }], // check for return type in map, foreach, ...

			// other js/ts rules from the unicorn package
			'unicorn/no-null': 'error', // disable null (it works inside of triple = if)
			'unicorn/no-for-loop': 'error', // disable for loop when it can be replaced with a for-of
			'unicorn/no-thenable': 'error', // disable .then
			'unicorn/no-new-array': 'error', // creare new array of x elements only with Array.from({length: lenght}) instead of new Array(100)
			'unicorn/error-message': 'error', // require message when creating an error new Error("msg")
			'unicorn/new-for-builtins': 'error', // require the new keyword when necessary and removes it when is not
			'unicorn/no-instanceof-array': 'error', // prevents bug when checking if a variable is an array
			'unicorn/consistent-destructuring': 'error', // consistent deconstruct (deconstruct all or nothing)
			'unicorn/prefer-string-trim-start-end': 'error', // use trimStart/trimEnd instead of trimLeft/trimRight
			'unicorn/prefer-string-starts-ends-with': 'error', // use "".startsWith or "".endsWith instead of regex

			// style rules
			'perfectionist/sort-maps': ['error', { type: 'line-length' }],
			'perfectionist/sort-classes': ['error', { type: 'line-length' }],
			'perfectionist/sort-exports': ['error', { type: 'line-length' }],
			'perfectionist/sort-jsx-props': ['error', { type: 'line-length' }],
			'perfectionist/sort-intersection-types': ['error', { type: 'line-length' }],
			'perfectionist/sort-union-types': ['error', { 'nullable-last': true, 'type': 'line-length' }],
			'perfectionist/sort-array-includes': ['error', { 'spread-last': true, 'type': 'line-length' }],
			'perfectionist/sort-named-exports': ['error', { 'type': 'line-length', 'group-kind': 'types-first' }],
			'perfectionist/sort-named-imports': ['error', { 'type': 'line-length', 'group-kind': 'types-first' }],
			'perfectionist/sort-object-types': ['error', { 'type': 'line-length', 'groups': ['multiline'], 'partition-by-new-line': true }],
			// 'perfectionist/sort-objects': ['error', { 'type': 'line-length', 'partition-by-comment': true, 'partition-by-new-line': true }],
			'perfectionist/sort-svelte-attributes': ['error', { type: 'line-length', groups: ['multiline', 'shorthand', 'svelte-shorthand'] }],
			'perfectionist/sort-imports': [
				'error',
				{
					'type': 'line-length',
					'internal-pattern': ['$lib/**', '~/**'],
					'groups': [
						['builtin-type', 'external-type'],
						['builtin', 'external'],

						['internal-type', 'parent-type', 'sibling-type', 'index-type'],
						['internal', 'parent', 'sibling', 'index'],

						['side-effect', 'object', 'unknown', 'style', 'side-effect-style']
					]
				}
			]
		}
	},
	// svelte
	{
		files: ['**/*.svelte'],
		// @ts-expect-error
		extends: svelte.configs['flat/recommended'],
		languageOptions: { parser: svelteParser, parserOptions: { parser: ts.parser } },
		rules: {
			'svelte/sort-attributes': 'off', // already checked by the "perfectionist" plugin
			'svelte/no-store-async': 'error', // disable async await in stores
			'svelte/no-reactive-reassign': 'error', // don't readding derived reactive values
			'svelte/no-useless-mustaches': 'error', // don't allow useless {}
			'svelte/infinite-reactive-loop': 'error', // prevent reactivity bug
			'svelte/valid-prop-names-in-kit-pages': 'error', // disable invalid exports in +page.svelte file
			'svelte/no-immutable-reactive-statements': 'error', // disable reactive statement for const values
			'svelte/no-export-load-in-svelte-module-in-kit-pages': 'error', // no function called load in script
			'svelte/block-lang': ['error', { script: ['ts'], enforceScriptPresent: true }], // require lang="ts" in the script tag

			// rules that doesn't work in svelte 5
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off'
		}
	},
	{
		linterOptions: { reportUnusedDisableDirectives: true },
		languageOptions: { parserOptions: { project: true, extraFileExtensions: ['.svelte'] } }
	}
) as ConfigWithExtends[]
