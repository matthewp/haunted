import { hook, Hook } from './hook.js';

const useMemo = hook(class extends Hook {
  constructor(id, el, fn, values) {
    super(id, el);
    this.value = fn();
    this.values = values;
  }

  update(fn, values) {
    if(this.hasChanged(values)) {
      this.values = values;
      this.value = fn();
    }
    return this.value;
  }

  hasChanged(values) {
    return values.some((value, i) => this.values[i] !== value);
  }
});

export { useMemo };