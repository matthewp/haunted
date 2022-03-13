import { Directive, directive, DirectiveParameters, ChildPart, PartInfo } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { GenericRenderer } from './core';
import { BaseScheduler } from './scheduler';

const includes = Array.prototype.includes;

interface Renderer extends GenericRenderer<ChildPart> {
  (this: ChildPart, ...args: unknown[]): unknown | void;
}

let partToScheduler: WeakMap<ChildPart, Scheduler> = new WeakMap();
let schedulerToPart: WeakMap<Scheduler, ChildPart> = new WeakMap();

class Scheduler extends BaseScheduler<object, ChildPart, Renderer, ChildPart> {
  args!: unknown[];

  constructor(renderer: Renderer, part: ChildPart) {
    super(renderer, part);
    this.state.virtual = true;
  }

  render(): unknown {
    return this.state.run(() => this.renderer.apply(this.host, this.args));
  }

  commit(result: unknown): void {
    // this.host.setValue(result);
    // this.host.commit();
  }

  teardown(): void {
    super.teardown();
    let part = schedulerToPart.get(this);
    partToScheduler.delete(part!);
  }
}

function makeVirtual() : any {

  function virtual(renderer: Renderer) {
    class VirtualDirective extends Directive {

      constructor(partInfo: PartInfo) {
        super(partInfo);
      }

      update(part: ChildPart, args: DirectiveParameters<this>) {
          let cont = partToScheduler.get(part);
          if(!cont) {
            cont = new Scheduler(renderer, part);
            partToScheduler.set(part, cont);
            schedulerToPart.set(cont, part);
            teardownOnRemove(cont, part);
          }
          cont.args = args;
          cont.update();
          const value = cont.render();
          return this.render(value);
      }
      render(...args: unknown[]) {
        return args;

      }
    }

    return directive(VirtualDirective);
  }

  return virtual;
}

function teardownOnRemove(cont: BaseScheduler<object, ChildPart, Renderer, ChildPart>, part: ChildPart, node = part.startNode): void {
  let frag = node!.parentNode!;
  let mo = new MutationObserver(mutations => {
    for(let mutation of mutations) {
      if(includes.call(mutation.removedNodes, node)) {
        mo.disconnect();

        if(node!.parentNode instanceof ShadowRoot) {
          teardownOnRemove(cont, part);
        } else {
          cont.teardown();
        }
        break;
      } else if(includes.call(mutation.addedNodes, node!.nextSibling)) {
        mo.disconnect();
        teardownOnRemove(cont, part, node!.nextSibling || undefined);
        break;
      }
    }
  });
  mo.observe(frag, { childList: true });
}

export { makeVirtual, Renderer as VirtualRenderer };
