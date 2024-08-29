import { fileURLToPath } from 'node:url'
import { Worker, isMainThread, parentPort, workerData as rawWorkerData } from 'node:worker_threads'
import { Schema } from '@effect/schema'
import { getExecutionId } from './executionOrder.ts'
import { Queue } from './queue.ts'

export declare namespace workerThreads {
	type Schema = {
		init: Schema.Schema<any, any, never>
		main: Schema.Schema<any, any, never>
		worker: Schema.Schema<any, any, never>
	}

	type WorkerProps<Schema extends workerThreads.Schema> = {
		workerData: Schema['init']['Type']
		queue: Queue<Schema['worker']['Type']>
		send: (data: Schema['main']['Encoded']) => Promise<void>
		terminate: () => void
	}

	type Props<Schema extends workerThreads.Schema> = {
		filePath: string
		schema: Schema
		worker: (props: workerThreads.WorkerProps<NoInfer<Schema>>) => Promise<void> | void
	}
}

export async function workerThreads<Schema extends workerThreads.Schema>(props: workerThreads.Props<Schema>) {
	const { executionId } = getExecutionId(props.filePath)

	if (isMainThread === false && process.env['workerThreadsId'] === executionId) {
		const worker = parentPort!
		const workerData = Schema.decodeSync(props.schema.init)(rawWorkerData)

		const queue = new Queue<Schema['worker']['Type']>()
		worker.on('message', rawData => {
			const data = Schema.decodeSync(props.schema.worker)(rawData)
			void queue.publish(data)
		})

		worker.on('exit', () => queue.close())
		worker.on('error', () => queue.close())
		worker.on('messageerror', () => queue.close())

		const send = async (rawData: Schema['main']['Encoded']) => {
			const data = await Schema.encodePromise(props.schema.main)(rawData)
			worker.postMessage(data)
		}

		await props.worker({ queue, send, workerData, terminate: process.exit })
		process.exit(0)
	}

	return {
		spawnWorker: (workerData: Schema['init']['Encoded']) => {
			const worker = new Worker(fileURLToPath(props.filePath), {
				workerData,
				env: {
					...process.env,
					workerThreadsId: executionId
				}
			})

			const queue = new Queue<Schema['main']['Type']>()
			worker.on('message', rawData => {
				const data = Schema.decodeSync(props.schema.main)(rawData)
				void queue.publish(data)
			})

			worker.on('exit', () => queue.close())
			worker.on('error', () => queue.close())
			worker.on('messageerror', () => queue.close())

			const send = async (rawData: Schema['worker']['Encoded']) => {
				const data = await Schema.encodePromise(props.schema.worker)(rawData)
				worker.postMessage(data)
			}

			return { queue, send, terminate: worker.terminate }
		}
	}
}
