import { hook, Hook } from './hook.js';

const useState = hook(class extends Hook {
  constructor(id, el, initialValue) {
    super(id, el);
    this.updater = this.updater.bind(this);
    this.makeArgs(initialValue);
  }

  update() {
    return this.args;
  }

  updater(value) {
    this.makeArgs(value);
    this.el._update();
  }

  makeArgs(value) {
    this.args = Object.freeze([value, this.updater]);
  }
});

export { useState };