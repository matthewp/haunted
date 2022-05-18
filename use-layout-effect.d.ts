import { State } from './state';
/**
 * @function
 * @param  {Effect} callback effecting callback
 * @param  {unknown[]} [values] dependencies to the effect
 * @return {void}
 */
declare const useLayoutEffect: (callback: (this: State<unknown>) => void | Promise<void> | VoidFunction, values?: unknown[] | undefined) => void;
export { useLayoutEffect };
