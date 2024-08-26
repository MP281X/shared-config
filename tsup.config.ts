import { tsupConfig } from './configs/tsup.ts'

export default tsupConfig(['cli/index.ts', 'configs/tsup.ts', 'stdlib/index.ts', 'tests/index.ts'])
