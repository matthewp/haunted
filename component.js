import { BaseScheduler } from './scheduler';
const toCamelCase = (val = '') => val.replace(/-+([a-z])?/g, (_, char) => char ? char.toUpperCase() : '');
function makeComponent(render) {
    class Scheduler extends BaseScheduler {
        frag;
        constructor(renderer, frag, host) {
            super(renderer, (host || frag));
            this.frag = frag;
        }
        commit(result) {
            render(result, this.frag);
        }
    }
    function component(renderer, baseElementOrOptions, options) {
        const BaseElement = (options || baseElementOrOptions || {}).baseElement || HTMLElement;
        const { observedAttributes = [], useShadowDOM = true, shadowRootInit = {} } = options || baseElementOrOptions || {};
        class Element extends BaseElement {
            _scheduler;
            static get observedAttributes() {
                return renderer.observedAttributes || observedAttributes || [];
            }
            constructor() {
                super();
                if (useShadowDOM === false) {
                    this._scheduler = new Scheduler(renderer, this);
                }
                else {
                    this.attachShadow({ mode: 'open', ...shadowRootInit });
                    this._scheduler = new Scheduler(renderer, this.shadowRoot, this);
                }
            }
            connectedCallback() {
                this._scheduler.update();
            }
            disconnectedCallback() {
                this._scheduler.teardown();
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) {
                    return;
                }
                let val = newValue === '' ? true : newValue;
                Reflect.set(this, toCamelCase(name), val);
            }
        }
        ;
        function reflectiveProp(initialValue) {
            let value = initialValue;
            let isSetup = false;
            return Object.freeze({
                enumerable: true,
                configurable: true,
                get() {
                    return value;
                },
                set(newValue) {
                    // Avoid scheduling update when prop value hasn't changed
                    if (isSetup && value === newValue)
                        return;
                    isSetup = true;
                    value = newValue;
                    if (this._scheduler) {
                        this._scheduler.update();
                    }
                }
            });
        }
        const proto = new Proxy(BaseElement.prototype, {
            getPrototypeOf(target) {
                return target;
            },
            set(target, key, value, receiver) {
                let desc;
                if (key in target) {
                    desc = Object.getOwnPropertyDescriptor(target, key);
                    if (desc && desc.set) {
                        desc.set.call(receiver, value);
                        return true;
                    }
                    Reflect.set(target, key, value, receiver);
                    return true;
                }
                if (typeof key === 'symbol' || key[0] === '_') {
                    desc = {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value
                    };
                }
                else {
                    desc = reflectiveProp(value);
                }
                Object.defineProperty(receiver, key, desc);
                if (desc.set) {
                    desc.set.call(receiver, value);
                }
                return true;
            }
        });
        Object.setPrototypeOf(Element.prototype, proto);
        return Element;
    }
    return component;
}
export { makeComponent };
