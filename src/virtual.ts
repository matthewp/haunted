import { directive, DirectiveParameters, ChildPart, PartInfo } from 'lit/directive.js';
import { noChange } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { GenericRenderer } from './core';
import { BaseScheduler } from './scheduler';

const includes = Array.prototype.includes;

interface Renderer extends GenericRenderer<ChildPart> {
  (this: ChildPart, ...args: unknown[]): unknown | void;
}

class Scheduler extends BaseScheduler<object, ChildPart, Renderer, ChildPart> {
  args!: unknown[];
  setValue: Function;

  constructor(renderer: Renderer, part: ChildPart, setValue: Function) {
    super(renderer, part);
    this.state.virtual = true;
    this.setValue = setValue;
  }

  render(): unknown {
    return this.state.run(() => this.renderer.apply(this.host, this.args));
  }

  commit(result: unknown): void {
    this.setValue(result);
  }

  teardown(): void {
    super.teardown();
  }
}

function makeVirtual() : any {

  function virtual(renderer: Renderer) {
    class VirtualDirective extends AsyncDirective {

      cont: Scheduler | null;

      constructor(partInfo: PartInfo) {
        super(partInfo);
        this.cont = null;
      }

      update(part: ChildPart, args: DirectiveParameters<this>) {
        if (this.cont === null) {
          this.cont = new Scheduler(renderer, part, (r: unknown) => {this.setValue(r)});
          teardownOnRemove(this.cont, part);
        }
        this.cont.args = args;
        this.cont.update();
        return this.render(args);
      }

      render(args: unknown) {
        return noChange;
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
