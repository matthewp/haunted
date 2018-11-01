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
});