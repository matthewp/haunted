import { html } from '../lit-html/lit-html.js';
import { component } from '../web.js';
import { attach, cycle } from './helpers.js';

describe('Shadow DOM', () => {
  it('works', async () => {
    customElements.define('shadow-test', component(() => {
      return html`using ShadowDOM`;
    }));

    let teardown = attach('shadow-test');
    await cycle();

    assert.equal(host.firstChild.shadowRoot.firstChild.nextSibling.nodeValue, 'using ShadowDOM', 'Rendered with Shadow DOM');
    teardown();
  });

  it('is optional', async () => {
    customElements.define('no-shadow-test', component(() => {
      return html`not using ShadowDOM`;
    }, HTMLElement, {useShadowDOM: false}));

    let teardown = attach('no-shadow-test');
    await cycle();

    assert.equal(host.innerText, 'not using ShadowDOM', 'Rendered without Shadow DOM');
    teardown();
  });

})