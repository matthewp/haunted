import { component, html } from '../web.js';
import { attach, afterMutations, later } from './helpers.js';

describe('Component exports', () => {
  it('works', async () => {
    customElements.define('exports-test', component(() => {
      return html`Test`;
    }));

    let p = afterMutations();
    let teardown = attach('exports-test');

    return later(() => {
      assert.equal(host.firstChild.shadowRoot.firstChild.nextSibling.nodeValue, 'Test', 'Rendered');
      teardown();
    });
  });
})