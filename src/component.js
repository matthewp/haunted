import { Container } from './core.js';

function component(renderer, BaseElement = HTMLElement, options = {useShadowDOM: true}) {
  class Element extends BaseElement {
    static get observedAttributes() {
      return renderer.observedAttributes || [];
    }

    constructor() {
      super();
      if (options.useShadowDOM === false) {
        this._container = new Container(renderer, this);
      } else {
        this.attachShadow({ mode: 'open' });
        this._container = new Container(renderer, this.shadowRoot, this);        
      }
    }

    connectedCallback() {
      this._container.update();
    }

    disconnectedCallback() {
      this._container.teardown();
    }

    attributeChangedCallback(name, _, newValue) {
      let val = newValue === '' ? true : newValue;
      Reflect.set(this, name, val);
    }
  };

  function reflectiveProp(initialValue) {
    let value = initialValue;
    return Object.freeze({
      enumerable: true,
      configurable: true,
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
        this._container.update();
      }
    })
  }

  const proto = new Proxy(BaseElement.prototype, {
    set(target, key, value, receiver) {
      if(key in target) {
        Reflect.set(target, key, value);
      }
      let desc;
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


  return Element;
}

export { component };
