import { directive, NodePart } from 'lit-html';
import { GenericRenderer } from './core';
import { BaseScheduler } from './scheduler';

const includes = Array.prototype.includes;

interface Renderer extends GenericRenderer {
  (this: NodePart, ...args: unknown[]): unknown | void;
}

function makeVirtual() {
  const partToScheduler: WeakMap<NodePart, Scheduler> = new WeakMap();
  const schedulerToPart: WeakMap<Scheduler, NodePart> = new WeakMap();

  class Scheduler extends BaseScheduler<Renderer, NodePart> {
    args!: unknown[];

    constructor(renderer: Renderer, part: NodePart) {
      super(renderer, part);
      this.state.virtual = true;
    }

    render(): unknown {
      return this.state.run(() => this.renderer.apply(this.host, this.args));
    }

    commit(result: unknown): void {
      this.host.setValue(result);
      this.host.commit();
    }

    teardown(): void {
      super.teardown();
      let part = schedulerToPart.get(this);
      partToScheduler.delete(part!);
    }
  }

  function virtual(renderer: Renderer) {
    function factory(...args: unknown[]) {
      return (part: NodePart): void => {
        let cont = partToScheduler.get(part);
        if(!cont) {
          cont = new Scheduler(renderer, part);
          partToScheduler.set(part, cont);
          schedulerToPart.set(cont, part);
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

function teardownOnRemove(cont: BaseScheduler<Renderer, NodePart>, part: NodePart, node = part.startNode): void {
  let frag = node.parentNode!;
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
        teardownOnRemove(cont, part, node.nextSibling || undefined);
        break;
      }
    }
  });
  mo.observe(frag, { childList: true });
}

export { makeVirtual, Renderer as VirtualRenderer };
