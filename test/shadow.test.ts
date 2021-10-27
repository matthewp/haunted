import { component, html } from '../src/haunted.js';
import { fixture, expect } from '@open-wc/testing';

describe('Shadow DOM', () => {
  it('works', async () => {
    customElements.define('shadow-test', component(() => {
      return html`using ShadowDOM`;
    }));

    const el = await fixture(html`<shadow-test></shadow-test>`);

    expect(el.shadowRoot.firstChild.nextSibling.nodeValue).to.equal('using ShadowDOM');
  });

  it('is optional', async () => {
    customElements.define('no-shadow-test', component(() => {
      return html`not using ShadowDOM`;
    }, HTMLElement, {useShadowDOM: false}));

    const el = await fixture<HTMLElement>(html`<no-shadow-test></no-shadow-test>`);

    expect(el.innerText).to.equal('not using ShadowDOM');
  });

  it('defaults to not delegating focus from the Shadow DOM', async () => {
    customElements.define('default-delegates-focus', component(() => {
      return html`does not delegate focus`;
    }));

    const el = await fixture<HTMLElement>(html`<default-delegates-focus></default-delegates-focus>`);

    expect(el.shadowRoot.delegatesFocus).to.be.false;
  })

  it('allows delegating focus from the Shadow DOM', async () => {
    customElements.define('delegates-focus', component(() => {
      return html`delegates focus`;
    }, HTMLElement, { shadowRootInit: {
        delegatesFocus: true,
        mode: 'open',
      } }));

    const el = await fixture<HTMLElement>(html`<delegates-focus></delegates-focus>`);

    expect(el.shadowRoot.delegatesFocus).to.be.true;
  })

})
