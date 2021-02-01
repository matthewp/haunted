import { GenericRenderer, RenderFunction } from './core';
import { BaseScheduler } from './scheduler';

const toCamelCase = (val = ''): string =>
  val.replace(/-+([a-z])?/g, (_, char) => char ? char.toUpperCase() : '');

interface Renderer<P extends object> extends GenericRenderer {
  (this: Component<P>, host: Component<P>): unknown | void;
  observedAttributes?: (keyof P)[];
}

type Component<P extends object> = Element & P;

type Constructor<P extends object> = new (...args: unknown[]) => Component<P>;

interface Creator {
  <P extends object>(renderer: Renderer<P>): Constructor<P>;
  <P extends object>(renderer: Renderer<P>, options: Options<P>): Constructor<P>;
  <P extends object>(renderer: Renderer<P>, baseElement: Constructor<{}>, options: Omit<Options<P>, 'baseElement'>): Constructor<P>;
}

interface Options<P> {
  baseElement?: Constructor<{}>;
  observedAttributes?: (keyof P)[];
  useShadowDOM?: boolean;
  shadowRootInit?: ShadowRootInit;
}

function makeComponent(render: RenderFunction): Creator {
  class Scheduler<P extends object> extends BaseScheduler<Renderer<P>, Element> {
    frag: DocumentFragment | Element;

    constructor(renderer: Renderer<P>, frag: DocumentFragment, host: Element);
    constructor(renderer: Renderer<P>, host: Element);
    constructor(renderer: Renderer<P>, frag: DocumentFragment | Element, host?: Element) {
      super(renderer, host || frag as Element);
      this.frag = frag;
    }

    commit(result: unknown): void {
      render(result, this.frag);
    }
  }

  function component<P extends object>(renderer: Renderer<P>): Constructor<P>;
  function component<P extends object>(renderer: Renderer<P>, options: Options<P>): Constructor<P>;
  function component<P extends object>(renderer: Renderer<P>, baseElement: Constructor<P>, options: Omit<Options<P>, 'baseElement'>): Constructor<P>;
  function component<P extends object>(renderer: Renderer<P>, baseElementOrOptions?: Constructor<P> | Options<P>, options?: Options<P>): Constructor<P> {
    const BaseElement = (options || baseElementOrOptions as Options<P> || {}).baseElement || HTMLElement;
    const {observedAttributes = [], useShadowDOM = true, shadowRootInit = {}} = options || baseElementOrOptions as Options<P> || {};

    class Element extends BaseElement {
      _scheduler: Scheduler<P>;

      static get observedAttributes(): (keyof P)[] {
        return renderer.observedAttributes || observedAttributes || [];
      }

      constructor() {
        super();
        if (useShadowDOM === false) {
          this._scheduler = new Scheduler(renderer, this);
        } else {
          this.attachShadow({ mode: 'open', ...shadowRootInit });
          this._scheduler = new Scheduler(renderer, this.shadowRoot!, this);
        }
      }

      connectedCallback(): void {
        this._scheduler.update();
      }

      disconnectedCallback(): void {
        this._scheduler.teardown();
      }

      attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
        if(oldValue === newValue) {
          return;
        }
        let val = newValue === '' ? true : newValue;
        Reflect.set(this, toCamelCase(name), val);
      }
    };

    function reflectiveProp<T>(initialValue: T): Readonly<PropertyDescriptor> {
      let value = initialValue;
      let isSetup = false;
      return Object.freeze({
        enumerable: true,
        configurable: true,
        get(): T {
          return value;
        },
        set(this: Element, newValue: T): void {
          // Avoid scheduling update when prop value hasn't changed
          if (isSetup && value === newValue) return;
          isSetup = true;
          value = newValue;
          this._scheduler.update();
        }
      })
    }

    const proto = new Proxy(BaseElement.prototype, {
      getPrototypeOf(target) {
        return target;
      },

      set(target, key: string, value, receiver): boolean {
        let desc: PropertyDescriptor | undefined;
        if(key in target) {
          desc = Object.getOwnPropertyDescriptor(target, key);
          if(desc && desc.set) {
            desc.set.call(receiver, value);
            return true;
          }

          Reflect.set(target, key, value, receiver);
          return true
        }

        if(typeof key === 'symbol' || key[0] === '_') {
          desc = {
            enumerable: true,
            configurable: true,
            writable: true,
            value
          };
        } else {
          desc = reflectiveProp(value);
        }
        Object.defineProperty(receiver, key, desc);

        if(desc.set) {
          desc.set.call(receiver, value);
        }

        return true;
      }
    });

    Object.setPrototypeOf(Element.prototype, proto);

    return Element as unknown as Constructor<P>;
  }

  return component;
}

export { makeComponent, Component, Constructor as ComponentConstructor, Creator as ComponentCreator };
