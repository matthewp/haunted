import { Container } from './core.js';
import { directive } from 'https://unpkg.com/lit-html@^0.12.0/lit-html.js';

class DirectiveContainer extends Container {
  commit(result) {
    this.host.setValue(result);
    this.host.commit();
  }
}

function withHooks(renderer) {
  const inst = new WeakMap();
  return function(...args){
    return directive(part => {
      let cont = inst.get(part);
      if(!cont) {
        cont = new DirectiveContainer(renderer, part);
        inst.set(part, cont);
      }
      cont.args = args;
      cont.update();
    });
  };
}

export { withHooks, withHooks as virtual }