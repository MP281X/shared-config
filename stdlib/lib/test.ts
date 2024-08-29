export { test } from 'node:test'

export const testing = process.env['NODE_TEST_CONTEXT']?.includes('child') ?? false
