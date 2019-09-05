import { hook, Hook } from './hook';
import { State } from './state';
import { effectsSymbol } from './symbols';

type Effect = (this: State) => void | VoidFunction;

function setEffects(state: State, cb: { call: (state: State) => void }) {
  state[effectsSymbol].push(cb);
}

const useEffect = hook(class extends Hook {
  callback!: Effect;
  lastValues?: unknown[];
  values!: unknown[];
  _teardown!: VoidFunction | void;

  constructor(id: number, state: State, ignored1: Effect, ignored2: unknown[]) {
    super(id, state);
    setEffects(state, this);
  }

  update(callback: Effect, values: unknown[]) {
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
    return !this.lastValues || this.values.some((value, i) => this.lastValues![i] !== value);
  }
});

export { setEffects, useEffect };
