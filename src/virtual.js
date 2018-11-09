import { Container } from './core.js';
import { directive } from './lit.js';

class DirectiveContainer extends Container {
  commit(result) {
    this.host.setValue(result);
    this.host.commit();
  }
}

const map = new WeakMap();

function withHooks(renderer) {
  function factory(...args) {
    return part => {
      let cont = map.get(part);
      if(!cont) {
        cont = new DirectiveContainer(renderer, part);
        map.set(part, cont);
      }
      cont.args = args;
      cont.update();
    };
  }

  return directive(factory);
}

export { withHooks, withHooks as virtual }