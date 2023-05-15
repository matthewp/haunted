import { ComponentConstructor, ComponentCreator } from './component';
import { contextEvent } from './symbols';
import { useContext } from './use-context';

interface ConsumerProps<T> {
  render: (value: T) => unknown,
}

interface Creator {
  <T>(defaultValue: T): Context<T>;
}

interface Context<T> {
  Provider: ComponentConstructor<{}>;
  Consumer: ComponentConstructor<ConsumerProps<T>>;
  defaultValue: T;
}

interface ContextDetail<T> {
  Context: Context<T>;
  callback: (value: T) => void;

  // These properties will not exist if a context consumer lacks a provider
  value: T;
  unsubscribe?: (this: Context<T>) => void;
}

function makeContext(component: ComponentCreator): Creator {
  return <T>(defaultValue: T): Context<T> => {
    const Context: Context<T> = {
      Provider: class extends HTMLElement {
        listeners: Set<(value: T) => void>;
        _value!: T;

        constructor() {
          super();
          this.listeners = new Set();

          this.addEventListener(contextEvent, this);
        }

        disconnectedCallback(): void {
          this.removeEventListener(contextEvent, this);
        }

        handleEvent(event: CustomEvent<ContextDetail<T>>): void {
          const { detail } = event;

          if (detail.Context === Context) {
            detail.value = this.value;
            detail.unsubscribe = this.unsubscribe.bind(this, detail.callback);

            this.listeners.add(detail.callback);

            event.stopPropagation();
          }
        }

        unsubscribe(callback: (value: T) => void): void {
          this.listeners.delete(callback);
        }

        set value(value: T) {
          this._value = value;
          for (let callback of this.listeners) {
            callback(value);
          }
        }

        get value(): T {
          return this._value;
        }
      },

      Consumer: component<ConsumerProps<T>>(function({ render }: ConsumerProps<T>): unknown {
        const context = useContext(Context);

        return render(context);
      }, { useShadowDOM: false }),

      defaultValue,
    };

    return Context;
  };
}

export { makeContext, Creator as ContextCreator, Context, ContextDetail };
