import { hook, Hook } from "./hook";
import { State } from "./state";

export type InitialState<T> = T | (() => T);
export type NewState<T> = T | ((previousState: T) => T);
export type StateUpdater<T> = (value: NewState<T>) => void;
export type StateTuple<T> = readonly [T, StateUpdater<T>];

export interface UseState {
  <T>(): StateTuple<T | undefined>;
  <T>(value?: InitialState<T>): StateTuple<T>;
}

/**
 * @function
 * @template {*} T
 * @param {T} [initialState] - Optional initial state
 * @return {StateTuple<T>} stateTuple - Tuple of current state and state updater function
 */
const useState = hook(
  class<T> extends Hook {
    args!: StateTuple<T>;

    constructor(id: number, state: State, initialValue: InitialState<T>) {
      super(id, state);
      this.updater = this.updater.bind(this);

      if (typeof initialValue === "function") {
        const initFn = initialValue as () => T;
        initialValue = initFn();
      }

      this.makeArgs(initialValue);
    }

    update(): StateTuple<T> {
      return this.args;
    }

    updater(value: NewState<T>): void {
      const [previousValue] = this.args;
      if (typeof value === "function") {
        const updaterFn = value as (previousState: T) => T;
        value = updaterFn(previousValue);
      }

      if (Object.is(previousValue, value)) {
        return;
      }

      this.makeArgs(value);
      this.state.update();
    }

    makeArgs(value: T): void {
      this.args = Object.freeze([value, this.updater]);
    }
  }
) as UseState;

export { useState };
