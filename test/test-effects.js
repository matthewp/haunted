import { component, html, useEffect, useState } from '../web.js';
import { attach, afterMutations, later } from './helpers.js';

describe('useEffect', () => {
  it('Memoizes values', async () => {
    const tag = 'memo-effect-test';
    let effects = 0;
    let set;

    function app() {
      let [,setVal] = useState(0);
      set = setVal;

      useEffect(() => {
        effects++;
      }, [1])

      return html`Test`;
    }
    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await later();

    set(2);
    await later();
    
    assert.equal(effects, 1, 'effects ran once');
    teardown();
  });

  it('Can teardown subscriptions', async () => {
    const tag = 'teardown-effect-test';
    let subs = [];
    let set;

    function app() {
      let [val, setVal] = useState(0);
      set = setVal;

      useEffect(() => {
        subs.push(val);
        return () => {
          subs.splice(subs.indexOf(val), 1);
        };
      });

      return html`Test`;
    }
    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await later();

    set(1);
    await later();

    set(2);
    await later();
    
    assert.equal(subs.length, 1, 'Unsubscribed on re-renders');
    teardown();
  });

  it('Tears-down on unmount', async () => {
    const tag = 'teardown-effect-unmount-test';
    let subs = [];

    function app() {
      let val = Math.random();

      useEffect(() => {
        subs.push(val);
        return () => {
          subs.splice(subs.indexOf(val), 1);
        };
      });

      return html`Test`;
    }

    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await later();

    teardown();
    await later();
    
    assert.equal(subs.length, 0, 'Torn down on unmount');
  });
});