import { component, html } from '../web.js';
import { attach, cycle } from './helpers.js';

describe('Component exports', () => {
  it('works', async () => {
    customElements.define('exports-test', component(() => {
      return html`Test`;
    }));

    let teardown = attach('exports-test');
    await cycle();

    assert.equal(host.firstChild.shadowRoot.firstChild.nextSibling.nodeValue, 'Test', 'Rendered');
    teardown();
  });
})