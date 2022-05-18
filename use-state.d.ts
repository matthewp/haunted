declare type NewState<T> = T | ((previousState?: T) => T);
declare type StateUpdater<T> = (value: NewState<T>) => void;
/**
 * @function
 * @template {*} T
 * @param {T} [initialState] - Optional initial state
 * @return {readonly [state: T, updaterFn: StateUpdater<T>]} stateTuple - Tuple of current state and state updater function
 */
declare const useState: <T>(initialValue?: T | undefined) => readonly [T extends (...args: any[]) => infer R ? R : T, StateUpdater<T extends (...args: any[]) => infer S ? S : T>];
export { useState };
