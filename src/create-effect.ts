import { Hook, hook } from './hook';
import { State, Callable } from './state';

type Effect = (this: State) => void | VoidFunction;

function createEffect(setEffects: (state: State, cb: Callable) => void) {
  return hook(class extends Hook {
    callback!: Effect;
    lastValues?: unknown[];
    values?: unknown[];
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
      let ret = this.callback.call(this.state);
      if(typeof ret === 'function') {
        this._teardown = ret;
      }
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
}

export { createEffect };
