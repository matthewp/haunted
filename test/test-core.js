import haunted, { useState } from '../core.js';
import { attach, cycle } from './helpers.js';

// This is just to get the lit-html export for testing.
import { html, render } from '../haunted.js';

describe('haunted/core', () => {
  describe('Building', () => {
    it('Can be used to build haunteds', async () => {
      const tag = 'custom-haunted-test';

      const { component } = haunted({
        render(what, where) {
          render(what, where);
        }
      });

      function App() {
        let [name] = useState('Matthew');
        return html`<span>Test-${name}</span>`;
      }

      customElements.define(tag, component(App));
  
      let teardown = attach(tag);
      await cycle();
  
      let span = host.firstChild.shadowRoot.firstElementChild;
      assert.equal(span.textContent, 'Test-Matthew', 'Rendered');
      teardown();
    });
  })
});