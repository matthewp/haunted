import { Hook } from "./hook";
import { setCurrent, clear } from "./interface";
import {
  hookSymbol,
  effectsSymbol,
  layoutEffectsSymbol,
  EffectsSymbols,
} from "./symbols";

interface Callable {
  call: (state: State) => void;
}

class State<H = unknown> {
  update: VoidFunction;
  host: H;
  virtual?: boolean;
  [hookSymbol]: Map<number, Hook>;
  [effectsSymbol]: Callable[];
  [layoutEffectsSymbol]: Callable[];

  constructor(update: VoidFunction, host: H) {
    this.update = update;
    this.host = host;
    this[hookSymbol] = new Map();
    this[effectsSymbol] = [];
    this[layoutEffectsSymbol] = [];
  }

  run<T>(cb: () => T): T {
    setCurrent(this);
    let res = cb();
    clear();
    return res;
  }

  _runEffects(phase: EffectsSymbols): void {
    let effects = this[phase];
    setCurrent(this);
    for (let effect of effects) {
      effect.call(this);
    }
    clear();
  }

  runEffects(): void {
    this._runEffects(effectsSymbol);
  }

  runLayoutEffects(): void {
    this._runEffects(layoutEffectsSymbol);
  }

  teardown(): void {
    let hooks = this[hookSymbol];
    hooks.forEach((hook) => {
      if (typeof hook.teardown === "function") {
        hook.teardown();
      }
    });
  }
}

export { State, Callable };
