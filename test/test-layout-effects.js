import { component, html, useLayoutEffect, useEffect, useState } from '../haunted.js';
import { attach, cycle } from './helpers.js';

describe('useLayoutEffect', () => {
  it('Is called', async () => {
    const tag = 'call-layout-effect-test';
    let ran = false;

    function app() {
      useLayoutEffect(() => {
        ran = true;
      });

      return html`Test`;
    }
    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await cycle();

    assert.equal(ran, true, 'Was called');

    teardown();
  });

  it('Is called before useEffect', async () => {
    const tag = 'order-effects-test';
    let effects = true;

    function app() {
      useEffect(() => {
        effects = true;
      });

      useLayoutEffect(() => {
        effects = false;
      });

      return html`Test`;
    }
    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await cycle();

    assert.equal(effects, true, 'Was called before useEffect');

    teardown();
  });

  it('Memoizes values', async () => {
    const tag = 'memo-layout-effect-test';
    let effects = 0;
    let set;

    function app() {
      let [,setVal] = useState(0);
      set = setVal;

      useLayoutEffect(() => {
        effects++;
      }, [1])

      return html`Test`;
    }
    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await cycle();

    set(2);
    await cycle();

    assert.equal(effects, 1, 'effects ran once');
    teardown();
  });

  it('Can teardown subscriptions', async () => {
    const tag = 'teardown-layout-effect-test';
    let subs = [];
    let set;

    function app() {
      let [val, setVal] = useState(0);
      set = setVal;

      useLayoutEffect(() => {
        subs.push(val);
        return () => {
          subs.splice(subs.indexOf(val), 1);
        };
      });

      return html`Test`;
    }
    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await cycle();

    set(1);
    await cycle();

    set(2);
    await cycle();

    assert.equal(subs.length, 1, 'Unsubscribed on re-renders');
    teardown();
  });

  it('Tears-down on unmount', async () => {
    const tag = 'teardown-layout-effect-unmount-test';
    let subs = [];

    function app() {
      let val = Math.random();

      useLayoutEffect(() => {
        subs.push(val);
        return () => {
          subs.splice(subs.indexOf(val), 1);
        };
      });

      return html`Test`;
    }

    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await cycle();

    teardown();
    await cycle();

    assert.equal(subs.length, 0, 'Torn down on unmount');
  });

  it('useLayoutEffect(fn) runs the effect after each render', async () => {
    const tag = 'no-values-layout-effect-test';
    let calls = 0;

    function App() {
      useLayoutEffect(() => {
        calls++;
      });
    }

    customElements.define(tag, component(App));
    const teardown = attach(tag);

    await cycle();
    assert.equal(calls, 1, 'called once');

    document.querySelector(tag).prop = 'foo';
    await cycle();
    assert.equal(calls, 2, 'called twice');

    teardown();
  });

  it('useLayoutEffect(fn, []) runs the effect only once', async () => {
    const tag = 'empty-array-layout-effect-test';
    let calls = 0;

    function App() {
      useLayoutEffect(() => {
        calls++;
      }, []);
    }

    customElements.define(tag, component(App));
    const teardown = attach(tag);

    await cycle();
    assert.equal(calls, 1, 'called once');

    document.querySelector(tag).prop = 'foo';
    await cycle();
    assert.equal(calls, 1, 'still called once');
    teardown();
  });
});
