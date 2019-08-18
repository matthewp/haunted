import { effectsSymbol } from './symbols.js';
import { hook, Hook } from './hook.js';

function setEffects(state, cb) {
  if(!(effectsSymbol in state)) {
    state[effectsSymbol] = [];
  }
  state[effectsSymbol].push(cb);
}

const useEffect = hook(class extends Hook {
  constructor(id, state) {
    super(id, state);
    this.values = false;
    setEffects(state, this);
  }

  update(callback, values) {
    this.callback = callback;
    this.lastValues = this.values;
    this.values = values;
  }

  call() {
    if(this.values) {
      if(this.hasChanged()) {
        this.run();
      }
    } else {
      this.run();
    }
  }

  run() {
    this.teardown();
    this._teardown = this.callback.call(this.state);
  }

  teardown() {
    if(this._teardown) {
      this._teardown();
    }
  }

  hasChanged() {
    return this.lastValues === false || this.values.some((value, i) => this.lastValues[i] !== value);
  }
});

export { setEffects, useEffect };