import utils from 'node:util'

export async function sleep(ms: number) {
	if (ms !== 0) await new Promise(resolve => setTimeout(resolve, ms))
	else await new Promise(resolve => setImmediate(resolve))
}

export function initTimer() {
	const startTime = Date.now()

	return {
		getElapsedTime: () => {
			const endTime = Date.now()
			return (endTime - startTime) / 1000
		}
	}
}

export function stringify(data: any) {
	return utils.formatWithOptions({ colors: true }, data)
}

export function resolvablePromise<T>() {
	let resolvePromise: (value: T) => void

	const promise = new Promise<T>(resolve => {
		resolvePromise = resolve
	})

	// @ts-expect-error
	return { resolvePromise, promise }
}

export declare namespace random {
	type Props = { min: number; max: number; step: number }
}
export function random({ min, max, step = 1 }: random.Props) {
	if (min >= max) return undefined

	const randomValue = Math.random() * (max - min) + min
	const steppedValue = Math.round(randomValue / step) * step

	const stepDecimals = step.toString().split('.').pop()!.length
	const roundedValue = Number(steppedValue.toFixed(Math.min(100, stepDecimals))) || undefined

	return roundedValue
}
