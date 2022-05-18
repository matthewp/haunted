import { useMemo } from './use-memo';
/**
 * @function
 * @template T
 * @param   {T} initialValue
 * @return  {{ current: T }} Ref
 */
const useRef = (initialValue) => useMemo(() => ({
    current: initialValue
}), []);
export { useRef };
