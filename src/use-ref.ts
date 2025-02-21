import { useMemo } from "./use-memo";

export interface Ref<T> {
  current: T;
}

/**
 * @function
 * @template T
 * @param   {T} initialValue
 * @return  {{ current: T }} Ref
 */
export function useRef<T>(): Ref<T | undefined>;
export function useRef<T>(initialValue: T): Ref<T>;
export function useRef<T>(initialValue?: T): Ref<T | undefined> {
  return useMemo(
    () => ({
      current: initialValue,
    }),
    []
  );
}
