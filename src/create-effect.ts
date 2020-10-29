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
      console.log(this.state.host, 'effect update', {lastValues: this.lastValues, values: this.values})
    }

    call(): void {
      if(!this.values || this.hasChanged()) {
        this.run();
      }
    }

    run(): void {
      console.log(this.state.host, 'effect run')
      this.teardown();
      this._teardown = this.callback.call(this.state);
    }

    teardown(): void {
      if(typeof this._teardown === 'function') {
        this._teardown();
      }
    }

    hasChanged(): boolean {
      return !this.lastValues || this.values!.some((value, i) => this.lastValues![i] !== value);
    }
  });
}

export { createEffect };
