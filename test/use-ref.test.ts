import { component, html, useRef, useState } from '../haunted.js';
import { attach, cycle } from './helpers.js';

describe('useRef', () => {
  it('always returns the same object', async () => {
    const tag = 'use-ref-test';
    let countRef;
    let requestRender;
    let timesRendered = 0;
    function app() {
      timesRendered++;
      countRef = useRef(0);
      [, requestRender] = useState(0);

      return html`Test`;
    }
    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await cycle();
    assert.equal(countRef.current, 0, 'countRef.current == 0');
    countRef.current++;
    requestRender();
    await cycle();
    assert.equal(timesRendered, 2, 'timesRendered == 2');
    assert.equal(countRef.current, 1, 'countRef.current == 1');    
    teardown();
  });

});