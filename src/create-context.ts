import { contextEvent } from './symbols.js';
import { useContext } from './use-context.js';

function makeContext(component) {
  return (defaultValue) => {
    const Context = {
      Provider: class extends HTMLElement {
        constructor() {
          super();
          this.listeners = new Set();

          this.addEventListener(contextEvent, this);
        }

        disconnectedCallback() {
          this.removeEventListener(contextEvent, this);
        }

        handleEvent(event) {
          const { detail } = event;

          if (detail.Context === Context) {
            detail.value = this.value;
            detail.unsubscribe = this.unsubscribe.bind(this, detail.callback);

            this.listeners.add(detail.callback);

            event.stopPropagation();
          }
        }

        unsubscribe(callback) {
          if(this.listeners.has(callback)) {
            this.listeners.delete(callback);
          }
        }

        set value(value) {
          this._value = value;
          for(let callback of this.listeners) {
            callback(value);
          }
        }

        get value() {
          return this._value;
        }
      },

      Consumer: component(function ({ render }) {
        const context = useContext(Context);

        return render(context);
      }),

      defaultValue
    };

    return Context;
  };
}

export { makeContext };
