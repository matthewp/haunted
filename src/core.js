import { commitSymbol, phaseSymbol, updateSymbol, hookSymbol, effectsSymbol } from './symbols.js';
import { setCurrent, clear } from './interface.js';
import { render, html } from 'https://unpkg.com/lit-html@^0.12.0/lit-html.js';

function scheduler() {
  let tasks = [];
  let id;

  function runTasks() {
    id = null;
    let t = tasks;
    tasks = [];
    for(var i = 0, len = t.length; i < len; i++) {
      t[i]();
    }
  }

  return function(task) {
    tasks.push(task);
    if(id == null) {
      id = requestAnimationFrame(runTasks);
    }
  };
}

const read = scheduler();
const write = scheduler();

function component(renderer, BaseElement = HTMLElement) {
  class Element extends BaseElement {
    static get observedAttributes() {
      return renderer.observedAttributes || [];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      this[hookSymbol] = new Map();
      this[phaseSymbol] = null;
      this._updateQueued = false;
    }

    connectedCallback() {
      this._update();
    }

    disconnectedCallback() {
      let effects = this[effectsSymbol];
      if(effects) {
        for(let effect of effects) {
          effect.teardown();
        }
      }
    }

    attributeChangedCallback(name, _, newValue) {
      Reflect.set(this, name, newValue);
    }

    _update() {
      if(this._updateQueued) return;
      read(() => {
        let result = this._handlePhase(updateSymbol);
        write(() => {
          this._handlePhase(commitSymbol, result);

          if(this[effectsSymbol]) {
            write(() => {
              this._handlePhase(effectsSymbol);
            });
          }
        });
        this._updateQueued = false;
      });
      this._updateQueued = true;
    }

    _handlePhase(phase, arg) {
      this[phaseSymbol] = phase;
      switch(phase) {
        case commitSymbol: return this._commit(arg);
        case updateSymbol: return this._render();
        case effectsSymbol: return this._runEffects(effectsSymbol);
      }
      this[phaseSymbol] = null;
    }

    _commit(result) {
      render(result, this.shadowRoot);
      this._runEffects(commitSymbol);
    }

    _render() {
      setCurrent(this);
      let result = renderer(this);
      clear();
      return result;
    }

    _runEffects(symbol) {
      let effects = this[symbol];
      if(effects) {
        setCurrent(this);
        for(let effect of effects) {
          effect.call(this);
        }
        clear();
      }
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
        this._update();
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

export { component, html };