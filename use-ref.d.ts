/**
 * @function
 * @template T
 * @param   {T} initialValue
 * @return  {{ current: T }} Ref
 */
declare const useRef: <T>(initialValue: T) => {
    current: T;
};
export { useRef };
