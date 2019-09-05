import { contextEvent } from './symbols.js';
import { hook, Hook } from './hook.js';
import { setEffects } from './use-effect.js';

const useContext = hook(class extends Hook {
  constructor(id, state) {
    super(id, state);
    this._updater = this._updater.bind(this);
    this._ranEffect = false;
    this._unsubscribe = null;
    setEffects(state, this);
  }

  update(Context) {
    if (this.state.virtual) {
      throw new Error('can\'t be used with virtual components');
    }

    if (this.Context !== Context) {
      this._subscribe(Context);
      this.Context = Context;
    }

    return this.value;
  }

  call() {
    if(!this._ranEffect) {
      this._ranEffect = true;
      if(this._unsubscribe) this._unsubscribe();
      this._subscribe(this.Context);
      this.state.update();
    }
  }

  _updater(value) {
    this.value = value;
    this.state.update();
  }

  _subscribe(Context) {
    const detail = { Context, callback: this._updater };

    this.state.host.dispatchEvent(new CustomEvent(contextEvent, {
      detail, // carrier
      bubbles: true, // to bubble up in tree
      cancelable: true, // to be able to cancel
      composed: true, // to pass ShadowDOM boundaries
    }));

    const { unsubscribe, value } = detail;

    this.value = unsubscribe ? value : Context.defaultValue;

    this._unsubscribe = unsubscribe;
  }

  teardown() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
});

export { useContext };
