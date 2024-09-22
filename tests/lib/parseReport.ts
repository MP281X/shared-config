import type { TestEvent } from 'node:test/reporters'

export type Test = {
	id?: string
	name: string
	file: string
	result: 'pass' | 'fail' | 'skip' | 'todo'
	error?: Error
	logs: string[]
}

export type Report = ReturnType<typeof parseReport>

export async function parseReport(source: AsyncIterable<TestEvent>) {
	const tests: Test[] = []
	const testStack: Test[] = []

	function getParentTest() {
		return testStack.length > 0 ? testStack[testStack.length - 1] : null
	}

	function formatFilePath(file: string | undefined) {
		return file?.replace(process.cwd() + '/', '') ?? 'node'
	}

	function getEventId(data: TestStart | DiagnosticData) {
		return `${data.nesting || 0}-${data.line || 0}-${data.column || 0}-${data.file || 'node'}`
	}

	for await (const event of source) {
		switch (event.type) {
			case 'test:start': {
				const id = getEventId(event.data)
				const parentName = getParentTest()?.name
				const name = parentName ? `${parentName}.${event.data.name}` : event.data.name

				if (name.includes('/')) break
				if (name.endsWith('.js') || name.endsWith('.jsx')) break
				if (name.endsWith('.ts') || name.endsWith('.tsx')) break

				testStack.push({
					id,
					name,
					logs: [],
					result: 'todo',
					file: formatFilePath(event.data.file)
				})

				break
			}

			case 'test:pass':
			case 'test:fail': {
				const currentTest = testStack.pop()

				if (currentTest === undefined) break
				if (event.data.details.type === 'suite') break

				if (event.type === 'test:pass') currentTest.result = 'pass'
				if (event.type === 'test:fail') currentTest.result = 'fail'
				if (event.data.skip) currentTest.result = 'skip'
				if (event.data.todo) currentTest.result = 'todo'

				if (event.type === 'test:fail') currentTest.error = event.data.details.error

				tests.push(currentTest)

				break
			}

			case 'test:diagnostic': {
				if (event.data.file === undefined) break

				const id = getEventId(event.data)
				const test = tests.find(test => test.id === id)
				test?.logs.push(event.data.message)

				break
			}
		}
	}

	return tests
}
