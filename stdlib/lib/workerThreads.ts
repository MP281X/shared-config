import { fileURLToPath } from 'node:url'
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import type { Schema } from '@effect/schema'
import { Queue } from './queue.ts'

export declare namespace workerThreads {
	type Schema = {
		init: Schema.Schema.All
		main: Schema.Schema.All
		worker: Schema.Schema.All
	}

	type WorkerHandler<Schema extends workerThreads.Schema> = (props: {
		initData: Schema['init']['Type']
		iterator: AsyncIterable<Schema['worker']['Type']>
		send: (data: Schema['main']['Encoded']) => void
	}) => Promise<void>

	type Props<Schema extends workerThreads.Schema> = {
		filePath: string
		schema: Schema
		worker: workerThreads.WorkerHandler<NoInfer<Schema>>
	}
}

export async function workerThreads<Schema extends workerThreads.Schema>(props: workerThreads.Props<Schema>) {
	if (isMainThread) {
		const spawnWorker = (workerData: Schema['init']['Encoded']) => {
			const queue = new Queue<Schema['main']['Encoded']>()

			const worker = new Worker(fileURLToPath(props.filePath), { workerData })
			worker.on('message', data => void queue.publish(data))

			worker.on('exit', () => queue.close())
			worker.on('error', () => queue.close())
			worker.on('messageerror', () => queue.close())

			const send = (data: Schema['worker']['Encoded']) => worker.postMessage(data)

			return { queue, send, terminate: worker.terminate }
		}

		return { spawnWorker }
	}

	const workerThread = parentPort!

	const initData = workerData as Schema['init']['Type']

	const queue = new Queue<Schema['worker']['Type']>()
	workerThread.on('message', data => void queue.publish(data))

	await props.worker({ iterator: queue, send: data => workerThread.postMessage(data), initData })
	process.exit(0)
}
