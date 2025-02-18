/**
 * @function
 * @template T
 * @param  {() => T} fn function to memoize
 * @param  {unknown[]} values dependencies to the memoized computation
 * @return {T} The next computed value
 */
declare const useMemo: <T>(fn: () => T, values: unknown[]) => T;
export { useMemo };
