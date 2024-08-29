import { fileURLToPath } from 'node:url'
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import { Schema } from '@effect/schema'
import { Queue } from './queue.ts'

export declare namespace workerThreads {
	type Schema = {
		init: Schema.Schema<any, any, never>
		main: Schema.Schema<any, any, never>
		worker: Schema.Schema<any, any, never>
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
			const worker = new Worker(fileURLToPath(props.filePath), { workerData })

			const queue = new Queue<Schema['main']['Type']>()
			worker.on('message', rawData => {
				const data = Schema.decodeSync(props.schema.main)(rawData)
				void queue.publish(data)
			})

			worker.on('exit', () => queue.close())
			worker.on('error', () => queue.close())
			worker.on('messageerror', () => queue.close())

			const send = (data: Schema['worker']['Encoded']) => worker.postMessage(data)

			return { queue, send, terminate: worker.terminate }
		}

		return { spawnWorker }
	}

	const worker = parentPort!
	const initData = Schema.decodeSync(props.schema.init)(workerData)

	const queue = new Queue<Schema['worker']['Type']>()
	worker.on('message', rawData => {
		const data = Schema.decodeSync(props.schema.worker)(rawData)
		void queue.publish(data)
	})

	await props.worker({ iterator: queue, send: data => worker.postMessage(data), initData })
	process.exit(0)
}
