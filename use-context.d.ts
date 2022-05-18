import { Context } from './create-context';
/**
 * @function
 * @template T
 * @param    {Context<T>} context
 * @return   {T}
 */
declare const useContext: <T>(Context: Context<T>) => T;
export { useContext };
