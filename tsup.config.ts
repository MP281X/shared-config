import { tsupConfig } from './configs/tsup.ts'

export default tsupConfig(['cli/index.ts', 'configs/tsup.ts', 'tests/index.ts', 'utils/index.ts'])
