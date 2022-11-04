import { Context, ContextDetail } from "./create-context";
import { Hook, hook } from "./hook";
import { State } from "./state";
import { contextEvent } from "./symbols";

/**
 * @function
 * @template T
 * @param  {Context} Context Context to provide a value for
 * @param  {T} value the current value
 * @param  {unknown[]} values dependencies to the value update
 * @return void
 */
export const useProvideContext = hook(
  class<T> extends Hook<[Context<T>, T, unknown[]], void, Element> {
    listeners: Set<(value: T) => void>;

    constructor(
      id: number,
      state: State<Element>,
      private context: Context<T>,
      private value: T,
      private values?: unknown[]
    ) {
      super(id, state);
      this.context = context;
      this.value = value;
      this.values = values;

      this.listeners = new Set();
      this.state.host.addEventListener(contextEvent, this);
    }

    disconnectedCallback() {
      this.state.host.removeEventListener(contextEvent, this);
    }

    handleEvent(event: CustomEvent<ContextDetail<T>>): void {
      const { detail } = event;

      if (detail.Context === this.context) {
        detail.value = this.value;
        detail.unsubscribe = this.unsubscribe.bind(this, detail.callback);

        this.listeners.add(detail.callback);

        event.stopPropagation();
      }
    }

    unsubscribe(callback: (value: T) => void): void {
      this.listeners.delete(callback);
    }

    update(context: Context<T>, value: T, values?: unknown[]): void {
      if (this.hasChanged(values)) {
        this.values = values;
        this.value = value;
        for (const callback of this.listeners) {
          callback(value);
        }
      }
    }

    hasChanged(values?: unknown[]) {
      const lastValues = this.values;

      if (lastValues == null || values == null) {
        return true;
      }

      return values.some((value, i) => lastValues[i] !== value);
    }
  }
);
