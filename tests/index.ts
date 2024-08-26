import type { TestEvent } from 'node:test/reporters'

import { formatReport } from './lib/formatReport.ts'
import { parseReport } from './lib/parseReport.ts'

export default async function* (source: AsyncIterable<TestEvent>) {
	const testReport = await parseReport(source)
	const formattedReport = formatReport(testReport)

	yield* formattedReport
}
