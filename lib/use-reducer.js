import { hook, Hook } from './hook.js';

const useReducer = hook(class extends Hook {
  constructor(id, state, _, initialState) {
    super(id, state);
    this.dispatch = this.dispatch.bind(this);
    this.state = initialState;
  }

  update(reducer) {
    this.reducer = reducer;
    return [this.state, this.dispatch];
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.state.update();
  }
});

export { useReducer };