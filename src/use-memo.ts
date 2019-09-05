import { hook, Hook } from './hook';
import { State } from './state';

const useMemo = hook(class<T> extends Hook {
  value: T;
  values: unknown[];

  constructor(id: number, state: State, fn: () => T, values: unknown[]) {
    super(id, state);
    this.value = fn();
    this.values = values;
  }

  update(fn: () => T, values: unknown[]) {
    if(this.hasChanged(values)) {
      this.values = values;
      this.value = fn();
    }
    return this.value;
  }

  hasChanged(values: unknown[]) {
    return values.some((value, i) => this.values[i] !== value);
  }
});

export { useMemo };
