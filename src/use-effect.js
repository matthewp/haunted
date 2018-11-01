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
    this.caller = this.caller.bind(this);
    this.values = [];
    setEffects(el, this.caller);
  }

  update(callback, values) {
    this.callback = callback;
    this.lastValues = this.values;
    this.values = values;
  }

  caller() {
    if(this.values) {
      if(this.hasChanged()) {
        this.callback.call(this.el);
      }
    } else {
      this.callback.call(this.el);
    }
  }

  hasChanged() {
    return this.values.some((value, i) => this.lastValues[i] !== value);
  }
});

export { useEffect };