const toCamelCase = (val = '') =>
  val.replace(/-+([a-z])?/g, (_, char) => char ? char.toUpperCase() : '');

function makeComponent(Scheduler) {
  function component(renderer, baseElementOrOptions, options) {
    const BaseElement = (options || baseElementOrOptions || {}).baseElement || HTMLElement;
    const {observedAttributes = [], useShadowDOM = true, shadowRootInit = {}} = options || baseElementOrOptions || {};

    class Element extends BaseElement {
      static get observedAttributes() {
        return renderer.observedAttributes || observedAttributes || [];
      }

      constructor() {
        super();
        if (useShadowDOM === false) {
          this._scheduler = new Scheduler(renderer, this);
        } else {
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

      attributeChangedCallback(name, _, newValue) {
        let val = newValue === '' ? true : newValue;
        Reflect.set(this, toCamelCase(name), val);
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
          this._scheduler.update();
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

  return component;
}

export { makeComponent };
