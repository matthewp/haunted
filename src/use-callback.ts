import { useMemo } from "./use-memo";

/**
 * @function
 * @template {Function} T
 * @param    {T} fn - callback to memoize
 * @param    {unknown[]} inputs - dependencies to callback memoization
 * @return   {T}
 */
const useCallback = <T extends Function>(fn: T, inputs: unknown[]) =>
  useMemo(() => fn, inputs);

export { useCallback };
