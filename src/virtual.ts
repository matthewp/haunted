import {
  directive,
  DirectiveParameters,
  ChildPart,
  PartInfo,
} from "lit/directive.js";
import { noChange } from "lit";
import { AsyncDirective } from "lit/async-directive.js";
import { GenericRenderer } from "./core";
import { BaseScheduler } from "./scheduler";

const includes = Array.prototype.includes;

interface Renderer<T extends unknown[]> extends GenericRenderer<ChildPart> {
  (this: ChildPart, ...args: T): unknown | void;
}

const partToScheduler: WeakMap<ChildPart, Scheduler<any>> = new WeakMap();
const schedulerToPart: WeakMap<Scheduler<any>, ChildPart> = new WeakMap();

class Scheduler<T extends unknown[]> extends BaseScheduler<
  object,
  ChildPart,
  Renderer<T>,
  ChildPart
> {
  args!: T;
  setValue: Function;

  constructor(renderer: Renderer<T>, part: ChildPart, setValue: Function) {
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
    let part = schedulerToPart.get(this);
    partToScheduler.delete(part!);
  }
}

interface VirtualRenderer<T extends unknown[]> {
  (this: ChildPart, ...args: T): unknown | void;
}
export interface Virtual {
  <T extends unknown[]>(renderer: VirtualRenderer<T>): (
    ...values: T
  ) => unknown;
}

function makeVirtual(): Virtual {
  function virtual<T extends unknown[]>(renderer: VirtualRenderer<T>) {
    class VirtualDirective extends AsyncDirective {
      cont: Scheduler<T> | undefined;

      constructor(partInfo: PartInfo) {
        super(partInfo);
        this.cont = undefined;
      }

      update(part: ChildPart, args: DirectiveParameters<this>) {
        this.cont = partToScheduler.get(part);
        if (!this.cont || this.cont.renderer !== renderer) {
          this.cont = new Scheduler(
            renderer as Renderer<T>,
            part,
            (r: unknown) => {
              this.setValue(r);
            }
          );
          partToScheduler.set(part, this.cont);
          schedulerToPart.set(this.cont, part);
          teardownOnRemove(this.cont, part);
        }
        this.cont.args = args;
        this.cont.update();
        return this.render(...args);
      }

      render(...args: T) {
        return noChange;
      }
    }

    return directive(VirtualDirective);
  }

  return virtual;
}

function teardownOnRemove<T extends unknown[]>(
  cont: BaseScheduler<object, ChildPart, Renderer<T>, ChildPart>,
  part: ChildPart,
  node = part.startNode
): void {
  let frag = node!.parentNode!;
  let mo = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (includes.call(mutation.removedNodes, node)) {
        mo.disconnect();

        if (node!.parentNode instanceof ShadowRoot) {
          teardownOnRemove(cont, part);
        } else {
          cont.teardown();
        }
        break;
      } else if (includes.call(mutation.addedNodes, node!.nextSibling)) {
        mo.disconnect();
        teardownOnRemove(cont, part, node!.nextSibling || undefined);
        break;
      }
    }
  });
  mo.observe(frag, { childList: true });
}

export { makeVirtual, Renderer as VirtualRenderer };
