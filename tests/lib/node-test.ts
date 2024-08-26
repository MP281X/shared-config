import type { TestContext } from 'node:test'

type TestFn = (arg0: {
	assert: TestContext['assert']
	log: ReturnType<typeof createLogger>
}) => Promise<void> | void

export const test = async (name: string, fn: TestFn) => {
	if (process.env['NODE_TEST_CONTEXT'] === undefined) return

	const nodeTest = await import('node:test')
	const assert = await import('node:assert/strict')

	await nodeTest.test(name, async ({ fullName }) => {
		await fn({ assert, log: createLogger(fullName) })
	})
}

test.only = async (name: string, fn: TestFn) => {
	if (process.env['NODE_TEST_CONTEXT'] === undefined) return

	const nodeTest = await import('node:test')
	const assert = await import('node:assert/strict')

	await nodeTest.only(name, async ({ fullName }) => {
		await fn({ assert, log: createLogger(fullName) })
	})
}

test.todo = async (name: string, fn: TestFn) => {
	if (process.env['NODE_TEST_CONTEXT'] === undefined) return

	const nodeTest = await import('node:test')
	const assert = await import('node:assert/strict')

	await nodeTest.todo(name, async ({ fullName }) => {
		await fn({ assert, log: createLogger(fullName) })
	})
}

test.skip = async (name: string, fn: TestFn) => {
	if (process.env['NODE_TEST_CONTEXT'] === undefined) return

	const nodeTest = await import('node:test')
	const assert = await import('node:assert/strict')

	await nodeTest.skip(name, async ({ fullName }) => {
		await fn({ assert, log: createLogger(fullName) })
	})
}

test.describe = async (name: string, fn: () => Promise<void> | void) => {
	if (process.env['NODE_TEST_CONTEXT'] === undefined) return

	const nodeTest = await import('node:test')

	await nodeTest.describe(name, async () => await fn())
}

function createLogger(testName: string) {
	return (data: any) => {
		console.log(`${testName}:::${data}`)
	}
}
