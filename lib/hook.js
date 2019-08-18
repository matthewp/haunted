import { current, notify } from './interface.js';
import { hookSymbol } from './symbols.js';

class Hook {
  constructor(id, state) {
    this.id = id;
    this.el = this.state = state;
  }
}

function use(Hook, ...args) {
  let id = notify();
  let hooks = current[hookSymbol];
  
  let hook = hooks.get(id);
  if(!hook) {
    hook = new Hook(id, current, ...args);
    hooks.set(id, hook);
  }

  return hook.update(...args);
}

function hook(Hook) {
  return use.bind(null, Hook);
}

export { hook, Hook };