import { test } from 'node:test'
export { it } from 'node:test'

const isTesting = process.env['NODE_TEST_CONTEXT']?.includes('child') ?? false

export async function describe(name: string, fn: () => Promise<void> | void) {
	if (isTesting === false) return

	await test.suite(name, fn)
}
