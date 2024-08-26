export function resolvablePromise<T>() {
	let resolvePromise: (value: T) => void

	const promise = new Promise<T>(resolve => {
		resolvePromise = resolve
	})

	// @ts-expect-error
	return { resolvePromise, promise }
}
