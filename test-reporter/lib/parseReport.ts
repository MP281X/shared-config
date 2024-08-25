import type { TestEvent } from 'node:test/reporters'

export type Test = {
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
	const logs: { path: string; file: string; log: string }[] = []

	function getParentTest() {
		return testStack.length ? testStack[testStack.length - 1] : null
	}

	function formatFilePath(file: string | undefined) {
		return file?.replace(process.cwd() + '/', '') ?? 'node'
	}

	for await (const event of source) {
		switch (event.type) {
			case 'test:start': {
				const parentName = getParentTest()?.name
				const name = parentName ? `${parentName}.${event.data.name}` : event.data.name

				testStack.push({
					name,
					result: 'todo',
					file: formatFilePath(event.data.file),
					logs: []
				})

				break
			}

			case 'test:pass':
			case 'test:fail': {
				const currentTest = testStack.pop()!
				if (event.data.details.type === 'suite') break

				if (event.type === 'test:pass') currentTest.result = 'pass'
				if (event.type === 'test:fail') currentTest.result = 'fail'
				if (event.data.skip) currentTest.result = 'skip'
				if (event.data.todo) currentTest.result = 'todo'

				if (event.type === 'test:fail') currentTest.error = event.data.details.error

				tests.push(currentTest)

				break
			}

			case 'test:stdout':
			case 'test:stderr': {
				if (event.data.message.includes(':::') === false) break
				const [rawPath, rawLog] = event.data.message.split(':::') as [string, string]

				const log = rawLog.trim()
				const path = rawPath.replaceAll(' ', '').split('>').join('.')

				logs.push({
					log: log,
					path: path,
					file: formatFilePath(event.data.file)
				})

				break
			}
		}
	}

	for (const log of logs) {
		const test = tests.find(test => test.name === log.path && test.file === log.file)
		test?.logs.push(log.log)
	}

	return tests
}
