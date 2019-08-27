import { effectsSymbol } from './symbols.js';
import { hook, Hook } from './hook.js';

function setEffects(state, cb) {
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
    if(!this.values || this.hasChanged()) {
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
