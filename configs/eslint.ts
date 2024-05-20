/* eslint-disable perfectionist/sort-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import fs from 'node:fs'

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

// @ts-expect-error: no type definitions
import tailwindcss from 'eslint-plugin-tailwindcss'

// @ts-expect-error: no type definitions
import nextjs from '@next/eslint-plugin-next'
// @ts-expect-error: no type definitions
import react from 'eslint-plugin-react'
// @ts-expect-error: no type definitions
import hooks from 'eslint-plugin-react-hooks'

const gitignore = () => {
	try {
		return fs
			.readFileSync('.gitignore')
			.toString()
			.split('\n')
			.map(line => line.split('#').shift()?.trim())
			.filter(line => line !== '' && line !== undefined) as string[]
	} catch {}
	return []
}

export default ts.config(
	{ ignores: gitignore() },
	// typescript
	{
		extends: [...ts.configs.strictTypeChecked],
		files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.svelte'],
		rules: {
			'@typescript-eslint/array-type': 'error', // use X[] instead of Array<X>
			'@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': false }], // allow only the @ts-expect-error
			'@typescript-eslint/ban-types': 'error', // disable problematic types -> {}
			'@typescript-eslint/consistent-generic-constructors': 'error', // specify types on constructor instead of on the variable
			'@typescript-eslint/consistent-indexed-object-style': 'error', // use Record<string,string> instead of {[key: string]:string}
			'@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }], // disable as (as const still work)
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'], // disable interface
			'@typescript-eslint/consistent-type-exports': 'error', // separate type export
			'@typescript-eslint/method-signature-style': 'error', // allow only arrow functions in types
			'@typescript-eslint/no-confusing-void-expression': 'off', // enable returning void -> ()=>console.log("ok")
			'@typescript-eslint/no-inferrable-types': 'error', // don't specify type for inferrable types
			'@typescript-eslint/no-meaningless-void-operator': 'off', // allow returning void, return void console.log("ok")
			'@typescript-eslint/no-non-null-assertion': 'off', // allow non null assestion
			'@typescript-eslint/no-require-imports': 'error', // disable require
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // allow writing if (var1 === false) instead of only if (!var1)
			'@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }], // diable const condition exept for loops
			'@typescript-eslint/no-unsafe-argument': 'off', // the rules doesn't work as expected
			'@typescript-eslint/no-unused-vars': 'off', // disable error for unused variables or params (already checked by typescript)
			'@typescript-eslint/prefer-for-of': 'error', // use for (const x of []) instead of normal for loop
			'@typescript-eslint/prefer-function-type': 'error', // disable defining function with this { (): string } instead of ()=>string
			'@typescript-eslint/prefer-readonly-parameter-types': ['error', { ignoreInferredTypes: true }], // allow only readonly parameters
			'@typescript-eslint/require-array-sort-compare': 'error', // require compare function as sort argument
			'@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }], // enable using number and other
			'@typescript-eslint/switch-exhaustiveness-check': 'error', // make switch check all cases
			'@typescript-eslint/unbound-method': 'off', // cause errors with the typescript compiler api

			// enforce variable naming style
			'@typescript-eslint/naming-convention': [
				'error',
				// allow
				{ format: null, selector: 'import' }, // eslint-disable-line unicorn/no-null
				{ format: ['camelCase'], selector: 'default' },
				{ format: ['camelCase'], selector: 'objectLiteralProperty' },
				{ format: ['camelCase', 'PascalCase'], selector: 'typeLike' },
				{ format: ['camelCase'], leadingUnderscore: 'allow', selector: 'parameter' },

				// boolean variables should start with one of these prefix
				{ format: ['PascalCase'], prefix: ['is', 'should', 'has', 'can', 'did', 'will'], selector: 'variable', types: ['boolean'] },

				// disallow the rules for evrithing that require the quotes
				{
					format: null, // eslint-disable-line unicorn/no-null
					modifiers: ['requiresQuotes'],
					selector: [
						'accessor',
						'enumMember',
						'typeMethod',
						'classMethod',
						'typeProperty',
						'classProperty',
						'objectLiteralMethod',
						'objectLiteralProperty'
					]
				}
			]
		}
	},
	// js/ts
	{
		extends: [prettier, eslint.configs.recommended],
		files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.svelte'],
		plugins: { perfectionist, unicorn },
		rules: {
			'array-callback-return': ['error', { allowImplicit: false, allowVoid: true, checkForEach: true }], // check for return type in map, foreach, ...
			'arrow-body-style': ['error', 'as-needed'], // don't use {} for inline return
			'curly': ['error', 'multi-or-nest'], // disable {} if it can stay inline
			'eqeqeq': ['error', 'always'], // require triple =
			'func-style': ['error', 'expression', { allowArrowFunctions: true }], // allow only const a = () =>{} or const a = function a() {}
			'grouped-accessor-pairs': ['error', 'getBeforeSet'], // require getters and setters to be near each other
			'no-array-constructor': 'error', // force consistent array of x element definitions
			'no-bitwise': 'error', // error if using | or & instead of || or &&
			'no-constant-condition': 'off', // already checked by typescript
			'no-else-return': 'error', // disable else if the if has a return
			'no-empty': ['error', { allowEmptyCatch: true }], // no empty block (catch excluded)
			'no-extend-native': 'error', // don't add property to global object
			'no-extra-boolean-cast': ['error', { enforceForLogicalOperands: true }], // don't use more than one ! before a variable
			'no-implicit-coercion': 'error', // no implicit type conversion 1+"1" -> string
			'no-multi-assign': 'error', // disable multi assing const a = b = 1
			'no-negated-condition': 'error', // no else after negation in if. if (!var1)
			'no-plusplus': 'error', // disable ++ and --
			'no-promise-executor-return': 'error', // no return in custom promise
			'no-redeclare': 'off', // already checked by typescript
			'no-restricted-syntax': ['error', 'TryStatement > FinallyClause'], // disable try-finally
			'no-return-assign': 'error', // no variable assignment in return
			'no-self-compare': 'error', // don't compare variable to itself
			'no-sequences': 'error', // disable multiple operation inline separated by ,
			'no-shadow': 'off', // already checked by the eslint typescript plugin
			'no-template-curly-in-string': 'error', // error if ${} it's used in a normal string (not template)
			'no-undef': 'off', // already checked by typescript
			'no-unused-vars': 'off', // already checked by typescript
			'no-var': 'error', // disable var keyword
			'object-shorthand': 'error', // disable object value with the same name as the key
			'operator-assignment': 'error', // use x+=1 instead of x = x+1
			'prefer-arrow-callback': ['error', { allowNamedFunctions: true }], // allow only arrow functions in callback
			'spaced-comment': ['error', 'always'], // space after comment
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

			// style rules
			'perfectionist/sort-array-includes': ['error', { 'spread-last': true, 'type': 'line-length' }],
			'perfectionist/sort-exports': ['error', { type: 'line-length' }],
			'perfectionist/sort-intersection-types': ['error', { type: 'line-length' }],
			'perfectionist/sort-jsx-props': ['error', { type: 'line-length' }],
			'perfectionist/sort-maps': ['error', { type: 'line-length' }],
			'perfectionist/sort-named-exports': ['error', { 'group-kind': 'types-first', 'type': 'line-length' }],
			'perfectionist/sort-named-imports': ['error', { 'group-kind': 'types-first', 'type': 'line-length' }],
			'perfectionist/sort-object-types': ['error', { 'groups': ['multiline'], 'partition-by-new-line': true, 'type': 'line-length' }],
			'perfectionist/sort-objects': ['error', { 'partition-by-comment': true, 'partition-by-new-line': true, 'type': 'natural' }],
			'perfectionist/sort-svelte-attributes': ['error', { groups: ['multiline', 'shorthand', 'svelte-shorthand'], type: 'line-length' }],
			'perfectionist/sort-union-types': ['error', { 'nullable-last': true, 'type': 'line-length' }],

			'perfectionist/sort-classes': [
				'error',
				{
					groups: [
						'index-signature',
						'static-property',
						'private-property',
						'property',
						'constructor',
						'static-method',
						'private-method',
						'static-private-method',
						'method',
						['get-method', 'set-method'],
						'unknown'
					],
					type: 'natural'
				}
			],
			'perfectionist/sort-imports': [
				'error',
				{
					'groups': [
						['builtin-type', 'external-type'],
						['builtin', 'external'],

						['internal-type', 'parent-type', 'sibling-type', 'index-type'],
						['internal', 'parent', 'sibling', 'index'],

						['side-effect', 'object', 'unknown', 'style', 'side-effect-style']
					],
					'internal-pattern': ['$lib/**', '~/**'],
					'type': 'line-length'
				}
			]
		}
	},
	// tailwindcss
	{
		files: ['**/*.tsx', '**/*.svelte'],
		plugins: { tailwindcss },
		rules: {
			'tailwindcss/enforces-negative-arbitrary-values': 'error',
			'tailwindcss/enforces-shorthand': 'error',
			'tailwindcss/no-contradicting-classname': 'error',
			'tailwindcss/no-custom-classname': 'error',
			'tailwindcss/no-unnecessary-arbitrary-value': 'error'
		}
	},
	// nextjs/react
	{
		extends: [hooks.configs.recommended, nextjs.configs.recommended, react.configs['jsx-runtime'], nextjs.configs['core-web-vitals']],
		files: ['**/*.tsx'],
		plugins: { '@next/next': nextjs, react, 'react-hooks': hooks },
		rules: {
			'react/hook-use-state': ['error', { allowDestructuredState: false }], // consistent names for useState hook getter and setter
			'react/jsx-boolean-value': 'error', // write boolean props like this <Comp boolProp /> instead of <Comp boolProp={true} />
			'react/jsx-fragments': ['error', 'syntax'], // enforce <></> fragment and allow React.Fragment only when the key needs to be specified
			'react/jsx-handler-names': 'error', // enforce naming conventions for event handlers
			'react/jsx-no-leaked-render': 'error', // don't allow invalid values in inline conditionals like {NaN && "ok"}, {0 && "ok"}
			'react/self-closing-comp': 'error', // self closing tags if there are no children

			// force components to be defined as arrow functions (allow only the default named function export)
			'react/function-component-definition': [
				'error',
				{ namedComponents: ['arrow-function', 'function-declaration'], unnamedComponents: 'arrow-function' }
			],

			// use curly braces for props/children only when necessary
			'react/jsx-curly-brace-presence': ['error', { children: 'never', propElementValues: 'always', props: 'never' }],

			// fix naming rules for jsx components
			'@typescript-eslint/naming-convention': ['error', { format: ['camelCase', 'PascalCase'], selector: ['variable', 'function'] }]
		}
	},
	// svelte
	{
		extends: svelte.configs['flat/recommended'] as any, // eslint-disable-line @typescript-eslint/no-explicit-any
		files: ['**/*.svelte'],
		languageOptions: { parser: svelteParser, parserOptions: { parser: ts.parser } },
		rules: {
			'svelte/block-lang': ['error', { enforceScriptPresent: true, script: ['ts'] }], // require lang="ts" in the script tag
			'svelte/infinite-reactive-loop': 'error', // prevent reactivity bug
			'svelte/no-export-load-in-svelte-module-in-kit-pages': 'error', // no function called load in script
			'svelte/no-immutable-reactive-statements': 'error', // disable reactive statement for const values
			'svelte/no-reactive-reassign': 'error', // don't readding derived reactive values
			'svelte/no-store-async': 'error', // disable async await in stores
			'svelte/no-useless-mustaches': 'error', // don't allow useless {}
			'svelte/sort-attributes': 'off', // already checked by the "perfectionist" plugin
			'svelte/valid-prop-names-in-kit-pages': 'error', // disable invalid exports in +page.svelte file

			// rules that doesn't work in svelte 5
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off'
		}
	},
	{
		languageOptions: { parserOptions: { extraFileExtensions: ['.svelte'], project: true } },
		linterOptions: { reportUnusedDisableDirectives: true }
	}
) as ConfigWithExtends[]
