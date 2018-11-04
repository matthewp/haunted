import { html } from '../node_modules/lit-html/lit-html.js';
import { component } from '../web.js';
import { attach, cycle } from './helpers.js';

describe('npm package', () => {
  it('works', async () => {
    

    customElements.define('npm-test', component(() => {
      return html`Test`;
    }));

    let teardown = attach('npm-test');
    await cycle();

    assert.equal(host.firstChild.shadowRoot.firstChild.nextSibling.nodeValue, 'Test', 'Rendered');
    teardown();
  });
})