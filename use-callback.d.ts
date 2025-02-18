/**
 * @function
 * @template {Function} T
 * @param    {T} fn - callback to memoize
 * @param    {unknown[]} inputs - dependencies to callback memoization
 * @return   {T}
 */
declare const useCallback: <T extends Function>(fn: T, inputs: unknown[]) => T;
export { useCallback };
