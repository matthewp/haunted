import { directive } from 'lit/directive.js';
import { noChange } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { BaseScheduler } from './scheduler';
const includes = Array.prototype.includes;
const partToScheduler = new WeakMap();
const schedulerToPart = new WeakMap();
class Scheduler extends BaseScheduler {
    args;
    setValue;
    constructor(renderer, part, setValue) {
        super(renderer, part);
        this.state.virtual = true;
        this.setValue = setValue;
    }
    render() {
        return this.state.run(() => this.renderer.apply(this.host, this.args));
    }
    commit(result) {
        this.setValue(result);
    }
    teardown() {
        super.teardown();
        let part = schedulerToPart.get(this);
        partToScheduler.delete(part);
    }
}
function makeVirtual() {
    function virtual(renderer) {
        class VirtualDirective extends AsyncDirective {
            cont;
            constructor(partInfo) {
                super(partInfo);
                this.cont = undefined;
            }
            update(part, args) {
                this.cont = partToScheduler.get(part);
                if (!this.cont || this.cont.renderer !== renderer) {
                    this.cont = new Scheduler(renderer, part, (r) => { this.setValue(r); });
                    partToScheduler.set(part, this.cont);
                    schedulerToPart.set(this.cont, part);
                    teardownOnRemove(this.cont, part);
                }
                this.cont.args = args;
                this.cont.update();
                return this.render(args);
            }
            render(args) {
                return noChange;
            }
        }
        return directive(VirtualDirective);
    }
    return virtual;
}
function teardownOnRemove(cont, part, node = part.startNode) {
    let frag = node.parentNode;
    let mo = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (includes.call(mutation.removedNodes, node)) {
                mo.disconnect();
                if (node.parentNode instanceof ShadowRoot) {
                    teardownOnRemove(cont, part);
                }
                else {
                    cont.teardown();
                }
                break;
            }
            else if (includes.call(mutation.addedNodes, node.nextSibling)) {
                mo.disconnect();
                teardownOnRemove(cont, part, node.nextSibling || undefined);
                break;
            }
        }
    });
    mo.observe(frag, { childList: true });
}
export { makeVirtual };
