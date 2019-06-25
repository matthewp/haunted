import haunted from '../core.js';
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
        return html`Test`;
      }

      customElements.define(tag, component(App));
  
      let teardown = attach(tag);
      await cycle();
  
      assert.equal(host.firstChild.shadowRoot.firstChild.nextSibling.nodeValue, 'Test', 'Rendered');
      teardown();
    });
  })
});