import { resolvablePromise } from './resolvablePromise.ts'

export declare namespace PubSub {
	type Node<T> = { value: T; next: Promise<Node<T>> }
}

export class PubSub<T> {
	private nextPromise: (value: PubSub.Node<T>) => void
	public tail: Promise<PubSub.Node<T>>

	constructor() {
		const { promise, resolvePromise } = resolvablePromise<PubSub.Node<T>>()

		this.tail = promise
		this.nextPromise = resolvePromise
	}

	createNode<T>(value: T) {
		const { promise: next, resolvePromise } = resolvablePromise<PubSub.Node<T>>()

		const node: PubSub.Node<T> = { value, next }

		return { node, resolvePromise }
	}

	publish(value: T) {
		const { node, resolvePromise } = this.createNode(value)

		this.nextPromise(node)
		this.nextPromise = resolvePromise
	}

	async *[Symbol.asyncIterator]() {
		let current = await this.tail

		while (true) {
			yield current.value
			current = await current.next
		}
	}
}
