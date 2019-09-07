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
  values!: unknown[] | undefined;
  _teardown!: VoidFunction | void;

  constructor(id: number, state: State, ignored1: Effect, ignored2?: unknown[]) {
    super(id, state);
    setEffects(state, this);
  }

  update(callback: Effect, values?: unknown[]): void {
    this.callback = callback;
    this.lastValues = this.values;
    this.values = values;
  }

  call(): void {
    if(!this.values || this.hasChanged()) {
      this.run();
    }
  }

  run(): void {
    this.teardown();
    this._teardown = this.callback.call(this.state);
  }

  teardown(): void {
    if(this._teardown) {
      this._teardown();
    }
  }

  hasChanged(): boolean {
    return !this.lastValues || this.values!.some((value, i) => this.lastValues![i] !== value);
  }
});

export { setEffects, useEffect };
