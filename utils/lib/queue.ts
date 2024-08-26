import { resolvablePromise } from './resolvablePromise.ts'

export class Queue<T> {
	private queue: T[]
	private nextPromises: (() => void)[]

	constructor() {
		this.queue = []
		this.nextPromises = []
	}

	publish(value: T) {
		this.queue.push(value)
		if (this.nextPromises.length <= 0) return

		const resolvePromise = this.nextPromises.shift()!
		resolvePromise()
	}

	async *[Symbol.asyncIterator]() {
		while (true) {
			if (this.queue.length <= 0) {
				const { promise, resolvePromise } = resolvablePromise<void>()

				this.nextPromises.push(resolvePromise)
				await promise
			}

			if (this.queue.length > 5) await new Promise(resolve => setImmediate(resolve))
			if (this.queue.length > 0) yield this.queue.shift()
		}
	}
}
