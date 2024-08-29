const executionMap = new Map<string, number>()

/**
 * Return an Id that it's consistent for every execution
 * It's based on the order of execution
 */
export const getExecutionId = (fileName: string) => {
	executionMap.get(fileName) ?? executionMap.set(fileName, 0)

	const index = executionMap.get(fileName) ?? 0
	executionMap.set(fileName, index + 1)

	return { executionId: index.toString() }
}
