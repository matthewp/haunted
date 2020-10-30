import { Context, ContextDetail } from './create-context';
import { hook, Hook } from './hook';
import { State } from './state';
import { contextEvent } from './symbols';
import { setEffects } from './use-effect';

const useContext = hook(class<T> extends Hook<[Context<T>], T, Element> {
  Context!: Context<T>;
  value!: T;
  _ranEffect: boolean;
  _unsubscribe?: VoidFunction | null;

  constructor(id: number, state: State<Element>, _: Context<T>) {
    super(id, state);
    this._updater = this._updater.bind(this);
    this._ranEffect = false;
    this._unsubscribe = null;
    setEffects(state, this);
  }

  update(Context: Context<T>): T {
    if (this.state.virtual) {
      throw new Error('can\'t be used with virtual components');
    }

    if (this.Context !== Context) {
      this._subscribe(Context);
      this.Context = Context;
    }

    return this.value;
  }

  call(): void {
    if(!this._ranEffect) {
      this._ranEffect = true;
      if(this._unsubscribe) this._unsubscribe();
      this._subscribe(this.Context);
      this.state.update();
    }
  }

  _updater(value: T): void {
    this.value = value;
    this.state.update();
  }

  _subscribe(Context: Context<T>): void {
    const detail = { Context, callback: this._updater };

    this.state.host.dispatchEvent(new CustomEvent(contextEvent, {
      detail, // carrier
      bubbles: true, // to bubble up in tree
      cancelable: true, // to be able to cancel
      composed: true, // to pass ShadowDOM boundaries
    }));

    const { unsubscribe, value } = detail as ContextDetail<T>;

    this.value = unsubscribe ? value : Context.defaultValue;

    this._unsubscribe = unsubscribe;
  }

  teardown(): void {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
});

export { useContext };
