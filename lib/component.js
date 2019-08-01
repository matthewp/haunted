
function toCamelCase(val = '') {
  return val.indexOf('-') === -1 ? val.toLowerCase() : val.toLowerCase().split('-').reduce((out, part) => {
    return out ? out + part.charAt(0).toUpperCase() + part.slice(1) : part;
  },'') 
}

function makeComponent(Container) {
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
          this._container = new Container(renderer, this);
        } else {
          this.attachShadow({ mode: "open", ...shadowRootInit});
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

  return component;
}

export { makeComponent };
