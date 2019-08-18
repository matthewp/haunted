import { hookSymbol, effectsSymbol } from './symbols.js';
import { setCurrent, clear } from './interface.js';

class State {
  constructor(update, host) {
    this.update = update;
    this.host = host;
    this[hookSymbol] = new Map();
    this[effectsSymbol] = [];
  }
  
  run(cb) {
    setCurrent(this);
    let res = cb();
    clear();
    return res;
  }

  runEffects() {
    let effects = this[effectsSymbol];
    if(effects) {
      setCurrent(this);
      for(let effect of effects) {
        effect.call(this);
      }
      clear();
    }
  }

  teardown() {
    let hooks = this[hookSymbol];
    hooks.forEach((hook) => {
      if (typeof hook.teardown === 'function') {
        hook.teardown();
      }
    })
  }
}

export { State };