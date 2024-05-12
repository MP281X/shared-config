import ts from 'typescript'

export const constFactory = (name: string, expression: ts.Expression) =>
	ts.factory.createVariableStatement(
		undefined,
		ts.factory.createVariableDeclarationList(
			[ts.factory.createVariableDeclaration(ts.factory.createIdentifier(name), undefined, undefined, expression)],
			ts.NodeFlags.Const
		)
	)

export const dynamicImportFactory = (path: string) =>
	ts.factory.createAwaitExpression(
		ts.factory.createCallExpression(
			// @ts-expect-error
			ts.factory.createToken(ts.SyntaxKind.ImportKeyword),
			undefined,
			[ts.factory.createStringLiteral(path)]
		)
	)

export const objectFactory = (obj: Record<string, ts.Expression>) =>
	ts.factory.createObjectLiteralExpression(
		Object.entries(obj).map(([key, value]) => ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(key), value)),
		true
	)

export const asyncArrowFnFactory = (expression: ts.Expression) =>
	ts.factory.createArrowFunction(
		[ts.factory.createToken(ts.SyntaxKind.AsyncKeyword)],
		undefined,
		[],
		undefined,
		ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
		ts.factory.createParenthesizedExpression(expression)
	)

export const defaultExportFactory = (varName: string, typeName?: string) =>
	ts.factory.createExportAssignment(
		undefined,
		undefined,
		typeName ?
			ts.factory.createAsExpression(
				ts.factory.createIdentifier(varName),
				ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(typeName), undefined)
			)
		:	ts.factory.createIdentifier(varName)
	)

// factory.createTypeReferenceNode(
//       factory.createIdentifier("Z"),
//       undefined
//     )

export const nodeToStr = (node: ts.Node) =>
	// @ts-expect-error
	ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }).printNode(ts.EmitHint.Unspecified, node, undefined)

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest

	it('const', () => {
		const code = nodeToStr(constFactory('x', ts.factory.createStringLiteral('value')))
		expect(code).toEqual('const x = "value";')
	})

	it('dynamic import', () => {
		const code = nodeToStr(dynamicImportFactory('./file.ts'))
		expect(code).toEqual('await import("./file.ts")')
	})

	it('object', () => {
		const code = nodeToStr(objectFactory({ key: ts.factory.createStringLiteral('value') }))
		expect(code.replaceAll(' ', '').replaceAll('\n', '')).toEqual('{"key":"value"}')
	})

	it('async arrow fn', () => {
		const code = nodeToStr(asyncArrowFnFactory(ts.factory.createStringLiteral('value')))
		expect(code).toEqual('async () => ("value")')
	})

	it('default export', () => {
		const code = nodeToStr(defaultExportFactory('var1'))
		expect(code).toEqual('export default var1;')
	})
}
