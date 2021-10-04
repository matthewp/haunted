import { component, html } from '../haunted.js';
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

  it('defaults to not delegating focus from the Shadow DOM', async () => {
    customElements.define('default-delegates-focus', component(() => {
      return html`does not delegate focus`;
    }));

    let teardown = attach('default-delegates-focus');
    await cycle();

    assert.equal(host.firstChild.shadowRoot.delegatesFocus, false, 'Does not delegate focus from the Shadow DOM');
    teardown();
  })

  it('allows delegating focus from the Shadow DOM', async () => {
    customElements.define('delegates-focus', component(() => {
      return html`delegates focus`;
    }, HTMLElement, { shadowRootInit: { delegatesFocus: true } }));

    let teardown = attach('delegates-focus');
    await cycle();

    assert.equal(host.firstChild.shadowRoot.delegatesFocus, true, 'Delegates focus from the Shadow DOM');
    teardown();
  })

})
