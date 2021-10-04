// @ts-check
import { component, html, useController } from '../haunted.js';
import { attach, cycle } from './helpers.js';

import {initialState, StatusRenderer, Task} from '@lit-labs/task';

describe('useController', () => {

  it('with simple controller', async () => {
    class SimpleController {
      host;
      x = 'x';
      z = 'z';

      constructor(host, z) {
        this.host = host;
        this.z = z;
        host.addController(this);
      }

      hostConnected() {
        setTimeout(() => {
          this.x = 'y'
          this.host.requestUpdate()
          setTimeout(() => {
            this.x = this.z;
          })
        }, 50);
      }
    }

    const useSimple = z => useController(host => new SimpleController(host, z))

    const tag = 'use-controller-callback';

    function App() {
      let { z } = useSimple('a');
      return html`<span>${z}</span>`;
    }

    customElements.define(tag, component(App));

    const teardown = attach(tag);

    await cycle();
    let span = host.firstChild.shadowRoot.firstElementChild;
    assert.equal(span.textContent, 'x', 'initial value');

    await new Promise(r => setTimeout(r, 20))
    assert.equal(span.textContent, 'y', 'updated value');

    await new Promise(r => setTimeout(r, 20))
    assert.equal(span.textContent, 'a', 'user value');

    teardown();
  });
});
