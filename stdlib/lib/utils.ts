export async function sleep(ms: number) {
	if (ms !== 0) await new Promise(resolve => setTimeout(resolve, ms))
	else await new Promise(resolve => setImmediate(resolve))
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
