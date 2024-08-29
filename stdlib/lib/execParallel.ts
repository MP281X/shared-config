import { fileURLToPath } from 'node:url'
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import { getExecutionId } from './executionOrder.ts'
import { fork, resolvablePromise } from './utils.ts'

export function execParallel<Props, ReturnType>(filePath: string, fn: (props: Props) => ReturnType) {
	const { executionId } = getExecutionId(filePath)

	if (isMainThread === false && process.env['execParallelId'] === executionId) {
		fork(async () => {
			const res = await fn(workerData)
			parentPort?.postMessage(res)

			process.exit(0)
		})
	}

	return (props: Props) => {
		const worker = new Worker(fileURLToPath(filePath), {
			workerData: props,
			env: { ...process.env, execParallelId: executionId }
		})

		const { promise, resolvePromise } = resolvablePromise<ReturnType>()

		worker.on('message', data => {
			resolvePromise(data)
		})

		return promise
	}
}
