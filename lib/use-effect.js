import { effectsSymbol } from './symbols.js';
import { hook, Hook } from './hook.js';

function setEffects(el, cb) {
  if(!(effectsSymbol in el)) {
    el[effectsSymbol] = [];
  }
  el[effectsSymbol].push(cb);
}

const useEffect = hook(class extends Hook {
  constructor(id, el) {
    super(id, el);
    this.values = false;
    setEffects(el, this);
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
    this._teardown = this.callback.call(this.el);
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