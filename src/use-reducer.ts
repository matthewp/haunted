import { hook, Hook } from './hook';
import { State } from './state';

type Reducer<S, A> = (state: S, action: A) => S;

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
const useReducer = hook(class<S, I, A> extends Hook {
  reducer!: Reducer<S, A>;
  currentState: S;

  constructor(id: number, state: State, _: Reducer<S, A>, initialState: I, init?: (_:I) => S) {
    super(id, state);
    this.dispatch = this.dispatch.bind(this);
    this.currentState = init !== undefined ? init(initialState) : <S><any>initialState;
  }

  update(reducer: Reducer<S, A>): readonly [S, (action: A) => void] {
    this.reducer = reducer;
    return [this.currentState, this.dispatch];
  }

  dispatch(action: A): void {
    this.currentState = this.reducer(this.currentState, action);
    this.state.update();
  }
});

export { useReducer };
