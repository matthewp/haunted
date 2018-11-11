import { hook, Hook } from './hook.js';

const useReducer = hook(class extends Hook {
  constructor(id, el, _, initialState) {
    super(id, el);
    this.dispatch = this.dispatch.bind(this);
    this.state = initialState;
  }

  update(reducer) {
    this.reducer = reducer;
    return [this.state, this.dispatch];
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.el.update();
  }
});

export { useReducer };