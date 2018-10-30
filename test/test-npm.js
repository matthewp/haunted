import { html } from '../node_modules/lit-html/lit-html.js';
import { component } from '../index.js';
import { attach, afterMutations } from './helpers.js';

describe('npm package', () => {
  it('works', async () => {
    

    customElements.define('npm-test', component(() => {
      return html`Test`;
    }));

    let p = afterMutations();
    let teardown = attach('npm-test');

    return new Promise(resolve => {
      setTimeout(() => {
        assert.equal(host.firstChild.shadowRoot.firstChild.nextSibling.nodeValue, 'Test', 'Rendered');
        teardown();
        resolve();
      }, 100);
    })


  });
})