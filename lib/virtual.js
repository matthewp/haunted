import { directive } from 'lit-html';

const includes = Array.prototype.includes;

function makeVirtual(Scheduler) {
  const partToContainer = new WeakMap();
  const containerToPart = new WeakMap();
  
  class DirectiveContainer extends Scheduler {
    constructor(renderer, part) {
      super(renderer, part);
      this.virtual = true;
    }
  
    commit(result) {
      this.host.setValue(result);
      this.host.commit();
    }
  
    teardown() {
      super.teardown();
      let part = containerToPart.get(this);
      partToContainer.delete(part);
    }
  }
  
  function virtual(renderer) {
    function factory(...args) {
      return part => {
        let cont = partToContainer.get(part);
        if(!cont) {
          cont = new DirectiveContainer(renderer, part);
          partToContainer.set(part, cont);
          containerToPart.set(cont, part);
          teardownOnRemove(cont, part);
        }
        cont.args = args;
        cont.update();
      };
    }
  
    return directive(factory);
  }

  return virtual;
}

function teardownOnRemove(cont, part, node = part.startNode) {
  let frag = node.parentNode;
  let mo = new MutationObserver(mutations => {
    for(let mutation of mutations) {
      if(includes.call(mutation.removedNodes, node)) {
        mo.disconnect();

        if(node.parentNode instanceof ShadowRoot) {
          teardownOnRemove(cont, part);
        } else {
          cont.teardown();
        }
        break;
      } else if(includes.call(mutation.addedNodes, node.nextSibling)) {
        mo.disconnect();
        teardownOnRemove(cont, part, node.nextSibling);
        break;
      }
    }
  });
  mo.observe(frag, { childList: true });
}

export { makeVirtual };