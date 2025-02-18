import { State, Callable } from './state';
declare function setEffects(state: State, cb: Callable): void;
/**
 * @function
 * @param {() => void} effect - callback function that runs each time dependencies change
 * @param {unknown[]} [dependencies] - list of dependencies to the effect
 * @return {void}
 */
declare const useEffect: (callback: (this: State<unknown>) => void | Promise<void> | VoidFunction, values?: unknown[] | undefined) => void;
export { setEffects, useEffect };
