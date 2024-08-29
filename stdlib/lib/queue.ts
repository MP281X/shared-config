import { resolvablePromise } from './resolvablePromise.ts'

export class Queue<T> {
	private queue: T[]
	private nextPromises: (() => void)[]
	private isClosed: boolean

	constructor() {
		this.queue = []
		this.nextPromises = []
		this.isClosed = false
	}

	publish(value: T) {
		this.queue.push(value)
		if (this.nextPromises.length <= 0) return

		const resolvePromise = this.nextPromises.shift()!
		resolvePromise()
	}

	close() {
		this.isClosed = true
	}

	async *[Symbol.asyncIterator]() {
		while (true) {
			if (this.queue.length <= 0 && this.isClosed) return

			if (this.queue.length <= 0) {
				const { promise, resolvePromise } = resolvablePromise<void>()

				this.nextPromises.push(resolvePromise)
				await promise
			}

			yield this.queue.shift()
			await new Promise(resolve => setImmediate(resolve))
		}
	}
}
