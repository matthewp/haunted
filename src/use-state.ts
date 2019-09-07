import { hook, Hook } from './hook';
import { State } from './state';

type NewState<T> = T | ((previousState?: T) => T);
type StateUpdater<T> = (value: NewState<T>) => void;

const useState = hook(class<T> extends Hook {
  args!: readonly [T, StateUpdater<T>];

  constructor(id: number, state: State, initialValue: T) {
    super(id, state);
    this.updater = this.updater.bind(this);

    if(typeof initialValue === 'function') {
      initialValue = initialValue();
    }

    this.makeArgs(initialValue);
  }

  update(): readonly [T, StateUpdater<T>] {
    return this.args;
  }

  updater(value: NewState<T>): void {
    if (typeof value === 'function') {
      const updaterFn = value as (previousState?: T) => T;
      const [previousValue] = this.args;
      value = updaterFn(previousValue);
    }

    this.makeArgs(value);
    this.state.update();
  }

  makeArgs(value: T): void {
    this.args = Object.freeze([value, this.updater] as const);
  }
});

export { useState };
