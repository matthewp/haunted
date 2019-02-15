import { contextSymbol, contextEvent } from './symbols.js';
import { hook, Hook } from './hook.js';

function setContexts(el, consumer) {
  if(!(contextSymbol in el)) {
    el[contextSymbol] = [];
  }
  el[contextSymbol].push(consumer);
}

const useContext = hook(class extends Hook {
  constructor(id, el) {
    super(id, el);
    setContexts(el, this);
    this._updater = this._updater.bind(this);
  }

  update(Context) {
    if (this.el.virtual) {
      throw new Error('can\'t be used with virtual components');
    }

    if (this.Context !== Context) {
      this._subscribe(Context);
      this.Context = Context;
    }

    return this.value;
  }

  _updater(value) {
    this.value = value;
    this.el.update();
  }

  _subscribe(Context) {
    const detail = { Context, callback: this._updater };

    this.el.host.dispatchEvent(new CustomEvent(contextEvent, {
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
