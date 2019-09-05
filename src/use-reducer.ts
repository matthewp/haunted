import { hook, Hook } from './hook';
import { State } from './state';

type Reducer<S, A> = (state: S, action: A) => S;

const useReducer = hook(class<S, A> extends Hook {
  reducer!: Reducer<S, A>;
  currentState: S;

  constructor(id: number, state: State, _: Reducer<S, A>, initialState: S) {
    super(id, state);
    this.dispatch = this.dispatch.bind(this);
    this.currentState = initialState;
  }

  update(reducer: Reducer<S, A>) {
    this.reducer = reducer;
    return [this.state, this.dispatch];
  }

  dispatch(action: A) {
    this.currentState = this.reducer(this.currentState, action);
    this.state.update();
  }
});

export { useReducer };
