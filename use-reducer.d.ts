declare type Reducer<S, A> = (state: S, action: A) => S;
/**
 * Given a reducer function, initial state, and optional state initializer function, returns a tuple of state and dispatch function.
 * @function
 * @template S State
 * @template I Initial State
 * @template A Action
 * @param {Reducer<S, A>} reducer - reducer function to compute the next state given the previous state and the action
 * @param {I} initialState - the initial state of the reducer
 * @param {(init: I) => S} [init=undefined] - Optional initializer function, called on initialState if provided
 * @return {readonly [S, (action: A) => void]}
 */
declare const useReducer: <S, I, A>(_: Reducer<S, A>, initialState: I, init?: ((_: I) => S) | undefined) => readonly [S, (action: A) => void];
export { useReducer };
