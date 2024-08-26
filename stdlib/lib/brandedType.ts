const BrandTypeId: unique symbol = Symbol.for('brandedType')
export type BrandedType<Id extends string, Type extends unknown> = Type & {
	readonly [BrandTypeId]: {
		// biome-ignore lint/style/useNamingConvention:
		readonly [k in Id]: Id
	}
}
