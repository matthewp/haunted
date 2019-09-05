import { ComponentConstructor, ComponentCreator } from './component';
import { contextEvent } from './symbols';
import { useContext } from './use-context';

interface ConsumerProps<T> {
  render: (value: T) => unknown,
}

export interface Context<T> {
  Provider: ComponentConstructor<{}>;
  Consumer: ComponentConstructor<ConsumerProps<T>>;
  defaultValue: T;
}

export interface ContextDetail<T> {
  Context: Context<T>;
  callback: (value: T) => void;

  value: T;
  unsubscribe: (this: Context<T>) => void;
}

function makeContext(component: ComponentCreator) {
  return <T>(defaultValue: T) => {
    const Context: Context<T> = {
      Provider: class extends HTMLElement {
        listeners: Set<(value: T) => void>;
        _value!: T;

        constructor() {
          super();
          this.listeners = new Set();

          this.addEventListener(contextEvent, this);
        }

        disconnectedCallback() {
          this.removeEventListener(contextEvent, this);
        }

        handleEvent(event: CustomEvent<ContextDetail<T>>) {
          const { detail } = event;

          if (detail.Context === Context) {
            detail.value = this.value;
            detail.unsubscribe = this.unsubscribe.bind(this, detail.callback);

            this.listeners.add(detail.callback);

            event.stopPropagation();
          }
        }

        unsubscribe(callback: (value: T) => void) {
          this.listeners.delete(callback);
        }

        set value(value) {
          this._value = value;
          for (let callback of this.listeners) {
            callback(value);
          }
        }

        get value() {
          return this._value;
        }
      },

      Consumer: component<ConsumerProps<T>>(function({ render }: ConsumerProps<T>) {
        const context = useContext(Context);

        return render(context);
      }),

      defaultValue,
    };

    return Context;
  };
}

export { makeContext };
