import { useMemo } from "./use-memo";

/**
 * @function
 * @template T
 * @param   {T} initialValue
 * @return  {{ current: T }} Ref
 */
const useRef = <T>(initialValue: T) =>
  useMemo(
    () => ({
      current: initialValue,
    }),
    []
  );

export { useRef };
