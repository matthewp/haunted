import { Hook } from './hook';
import { setCurrent, clear } from './interface';
import { hookSymbol, effectsSymbol } from './symbols';

class State<H = unknown> {
  update: VoidFunction;
  host: H;
  virtual?: boolean;
  [hookSymbol]: Map<number, Hook>;
  [effectsSymbol]: { call: (state: State) => void }[];

  constructor(update: VoidFunction, host: H) {
    this.update = update;
    this.host = host;
    this[hookSymbol] = new Map();
    this[effectsSymbol] = [];
  }

  run<T>(cb: () => T) {
    setCurrent(this);
    let res = cb();
    clear();
    return res;
  }

  runEffects() {
    let effects = this[effectsSymbol];
    setCurrent(this);
    for(let effect of effects) {
      effect.call(this);
    }
    clear();
  }

  teardown() {
    let hooks = this[hookSymbol];
    hooks.forEach(hook => {
      if (typeof hook.teardown === 'function') {
        hook.teardown();
      }
    })
  }
}

export { State };
