import { useMemo } from './use-memo';

const useCallback = <T extends Function>(fn: T, inputs: unknown[]) => useMemo(() => fn, inputs);

export { useCallback };
