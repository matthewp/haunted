import { component, html, useEffect, useState } from '../haunted.js';
import { attach, cycle } from './helpers.js';

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
    await cycle();

    set(2);
    await cycle();

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
    await cycle();

    set(1);
    await cycle();

    set(2);
    await cycle();

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
    await cycle();

    teardown();
    await cycle();

    assert.equal(subs.length, 0, 'Torn down on unmount');
  });

  it('useEffect(fn, []) runs the effect only once', async () => {
    const tag = 'empty-array-effect-test';
    let calls = 0;

    function App() {
      useEffect(() => {
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

  it('Can be async functions', async () => {
    const tag = 'effect-async-fn';

    function App() {
      useEffect(async () => {

      });
    }

    customElements.define(tag, component(App));
    const teardown = attach(tag);

    await cycle();
    try {
      teardown();
      assert.ok(true, 'worked');
    } catch(e) {
      assert.ok(false, e);
    }
  });

  it('Does not skip effects when another update is queued during commit phase', async () => {
    const parentTag = 'skipped-effect-test-parent';
    const childTag = 'skipped-effect-test-child';
    let parentEffects = 0;
    let childEffects = 0;
    let parentSet;
    let childSet;

    function parent() {
      const [state, setState] = useState();
      parentSet = setState;

      useEffect(() => {
        parentEffects++;
      }, [state])

      return html`<skipped-effect-test-child .prop=${state}></skipped-effect-test-child>`;
    }

    function child({ prop }) {
      const [state, setState] = useState();
      childSet = setState;

      useEffect(() => {
        childEffects++;
      }, [state])

      return html`${prop} + ${state}`;
    }
    customElements.define(parentTag, component(parent));
    customElements.define(childTag, component(child));

    const teardown = attach(parentTag);
    await cycle();

    console.log('start test')
    console.log('parentSet(1)')
    parentSet(1)
    console.log('childSet(1)')
    childSet(1)
    console.log('await cycle()')
    await cycle();
    console.log('end test')

    assert.equal(parentEffects, 2, 'parent effects ran twice');
    assert.equal(childEffects, 2, 'child effects ran twice');

    teardown();
  });
});