import { hook, Hook } from './hook.js';

const useState = hook(class extends Hook {
  constructor(id, el, initialValue) {
    super(id, el);
    this.updater = this.updater.bind(this);

    if(typeof initialValue === 'function') {
      initialValue = initialValue();
    }

    this.makeArgs(initialValue);
  }

  update() {
    return this.args;
  }

  updater(value) {
    if (typeof value === "function") {
      const updaterFn = value;
      const [previousValue] = this.args;
      value = updaterFn(previousValue);
    }

    this.makeArgs(value);
    this.el.update();
  }

  makeArgs(value) {
    this.args = Object.freeze([value, this.updater]);
  }
});

export { useState };
